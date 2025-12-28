const apiBase = '../backend/crud.php';
const courseSelect = document.getElementById('course_id');
const sectionSelect = document.getElementById('section_id');
const studentsTbody = document.querySelector('#studentsTable tbody');
const form = document.getElementById('studentForm');
const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingId = null;

async function fetchJSON(url, opts){ 
  const res = await fetch(url, opts);
  return res.json();
}

async function loadOptions(){
  // We will pull the courses and sections from the database by listing students then extracting distincts.
  // For more robust approach, you can add dedicated endpoints. For now, we fetch list and build options using SQL sample values.
  // We'll fetch courses and sections by requesting the list endpoint and then deduplicate.
  const res = await fetchJSON(apiBase + '?action=list');
  if (!res.success) { alert('Failed to load data: ' + (res.error||'Unknown')); return; }
  const rows = res.data;

  // Build unique courses and sections maps
  const courseMap = {};
  const sectionMap = {};
  rows.forEach(r=>{
    courseMap[r.course_id] = {course_id:r.course_id, course_code:r.course_code, course_name:r.course_name};
    sectionMap[r.section_id] = {section_id:r.section_id, name:r.section_name};
  });
  // If no courses present in students list (fresh DB), add a few hardcoded entries to allow creating students.
  if (Object.keys(courseMap).length === 0) {
    courseMap[1] = {course_id:1, course_code:'BSCS', course_name:'Bachelor of Science in Computer Science'};
    courseMap[2] = {course_id:2, course_code:'BSIT', course_name:'Bachelor of Science in Information Technology'};
  }
  if (Object.keys(sectionMap).length === 0) {
    sectionMap[1] = {section_id:1, name:'A'};
    sectionMap[2] = {section_id:2, name:'B'};
  }

  // Populate selects
  courseSelect.innerHTML = '';
  sectionSelect.innerHTML = '';
  Object.values(courseMap).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.course_id;
    opt.textContent = `${c.course_code} — ${c.course_name}`;
    courseSelect.appendChild(opt);
  });
  Object.values(sectionMap).forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.section_id;
    opt.textContent = s.name;
    sectionSelect.appendChild(opt);
  });
}

async function loadStudents(){
  const res = await fetchJSON(apiBase + '?action=list');
  if (!res.success) { alert('Could not list students: ' + (res.error||'')); return; }
  studentsTbody.innerHTML = '';
  res.data.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.student_id}</td>
                    <td>${s.name}</td>
                    <td>${s.course_code} — ${s.course_name}</td>
                    <td>${s.year_level}</td>
                    <td>${s.section_name}</td>
                    <td>
                      <button class="action-btn" data-id="${s.student_id}" data-action="edit">Edit</button>
                      <button class="action-btn delete-btn" data-id="${s.student_id}" data-action="delete">Delete</button>
                    </td>`;
    studentsTbody.appendChild(tr);
  });
  // attach handlers
  document.querySelectorAll('.action-btn').forEach(b=>b.addEventListener('click', onActionClick));
}

async function onActionClick(e){
  const id = e.currentTarget.dataset.id;
  const action = e.currentTarget.dataset.action;
  if (action === 'edit') {
    const res = await fetchJSON(apiBase + '?action=get&id=' + encodeURIComponent(id));
    if (!res.success) { alert('Could not fetch student'); return; }
    const s = res.data;
    document.getElementById('student_id').value = s.student_id;
    document.getElementById('student_id').disabled = true;
    document.getElementById('name').value = s.name;
    document.getElementById('year_level').value = s.year_level;
    document.getElementById('course_id').value = s.course_id;
    document.getElementById('section_id').value = s.section_id;
    editingId = s.student_id;
    saveBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
  } else if (action === 'delete') {
    if (!confirm('Delete student ' + id + '?')) return;
    const res = await fetchJSON(apiBase + '?action=delete&id=' + encodeURIComponent(id));
    if (!res.success) { alert('Delete failed: ' + (res.error||'')); return; }
    alert(res.message || 'Deleted');
    await refreshAll();
  }
}

form.addEventListener('submit', async function(ev){
  ev.preventDefault();
  const payload = {
    student_id: document.getElementById('student_id').value.trim(),
    name: document.getElementById('name').value.trim(),
    course_id: parseInt(document.getElementById('course_id').value),
    year_level: parseInt(document.getElementById('year_level').value),
    section_id: parseInt(document.getElementById('section_id').value)
  };
  const res = await fetchJSON(apiBase + '?action=create', {method:'POST', body: JSON.stringify(payload)});
  if (!res.success) { alert('Save failed: ' + (res.error||'')); return; }
  alert(res.message || 'Saved');
  form.reset();
  document.getElementById('student_id').disabled = false;
  await refreshAll();
});

updateBtn.addEventListener('click', async function(){
  if (!editingId) return;
  const payload = {
    student_id: document.getElementById('student_id').value.trim(),
    name: document.getElementById('name').value.trim(),
    course_id: parseInt(document.getElementById('course_id').value),
    year_level: parseInt(document.getElementById('year_level').value),
    section_id: parseInt(document.getElementById('section_id').value)
  };
  const res = await fetchJSON(apiBase + '?action=update', {method:'POST', body: JSON.stringify(payload)});
  if (!res.success) { alert('Update failed: ' + (res.error||'')); return; }
  alert(res.message || 'Updated');
  editingId = null;
  form.reset();
  document.getElementById('student_id').disabled = false;
  saveBtn.style.display = 'inline-block';
  updateBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  await refreshAll();
});

cancelBtn.addEventListener('click', ()=>{
  editingId = null;
  form.reset();
  document.getElementById('student_id').disabled = false;
  saveBtn.style.display = 'inline-block';
  updateBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
});

async function refreshAll(){
  await loadOptions();
  await loadStudents();
}

// initial load
refreshAll().catch(err=>console.error(err));
