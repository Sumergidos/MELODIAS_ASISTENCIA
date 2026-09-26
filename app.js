const members = [
  { name: "Alan Ruiz", status: "present", note: "" },
  { name: "Alex Santiago", status: "present", note: "" },
  { name: "Angel Huber", status: "present", note: "" },
  { name: "Angel Ruiz", status: "present", note: "" },
  { name: "Angela Ygnacio", status: "present", note: "" },
  { name: "Angelina Arteaga", status: "present", note: "" },
  { name: "Angelo Briones", status: "present", note: "" },
  { name: "Anyhela Espinola", status: "present", note: "" },
  { name: "Brayan Siccha", status: "present", note: "" },
  { name: "Bricely", status: "present", note: "" },
  { name: "Carlos Loyola", status: "present", note: "" },
  { name: "Camila", status: "present", note: "" },
  { name: "Ciclari Perez", status: "present", note: "" },
  { name: "Cielo Raico", status: "present", note: "" },
  { name: "Claudia Cabanillas", status: "present", note: "" },
  { name: "Cristina Corcuera", status: "present", note: "" },
  { name: "Cristhian Huaccha", status: "present", note: "" },
  { name: "Cristina Romero", status: "present", note: "" },
  { name: "Danna Gamarra", status: "present", note: "" },
  { name: "Dayana Acevedo", status: "present", note: "" },
  { name: "Edu Ravello", status: "present", note: "" },
  { name: "Emiliano", status: "present", note: "" },
  { name: "Elda Saavedra", status: "present", note: "" },
  { name: "Evelyn Dominguez", status: "present", note: "" },
  { name: "Fabricio", status: "present", note: "" },
  { name: "Gianella Ruiz", status: "present", note: "" },
  { name: "Grismey", status: "present", note: "" },
  { name: "Hector Vasquez", status: "present", note: "" },
  { name: "Isabella", status: "present", note: "" },
  { name: "Jazmin Velasquez", status: "present", note: "" },
  { name: "Jennyfer Neyra", status: "present", note: "" },
  { name: "Jesus Radas", status: "present", note: "" },
  { name: "Jesus Ramos", status: "present", note: "" },
  { name: "Joel Orbegozo", status: "present", note: "" },
  { name: "Jhol Azabache", status: "present", note: "" },
  { name: "Keysi Bautista", status: "present", note: "" },
  { name: "Kristel", status: "present", note: "" },
  { name: "Lisset García", status: "present", note: "" },
  { name: "Leydi Araujo", status: "present", note: "" },
  { name: "Luis Victorio", status: "present", note: "" },
  { name: "Mafer Avalos", status: "present", note: "" },
  { name: "Manuel Arteaga", status: "present", note: "" },
  { name: "Marely", status: "present", note: "" },
  { name: "Mia Vasquez", status: "present", note: "" },
  { name: "Mildrest", status: "present", note: "" },
  { name: "Naomi Adamari Villena", status: "present", note: "" },
  { name: "Neomar Pacheco", status: "present", note: "" },
  { name: "Nicole Gonzales", status: "present", note: "" },
  { name: "Paola Chirinos", status: "present", note: "" },
  { name: "Pepe", status: "present", note: "" },
  { name: "Piero Vilchez", status: "present", note: "" },
  { name: "Paul Dávalos", status: "present", note: "" },
  { name: "Puchini (Frank)", status: "present", note: "" },
  { name: "Rebeca", status: "present", note: "" },
  { name: "Sandra Ortiz", status: "present", note: "" },
  { name: "Sara", status: "present", note: "" },
  { name: "Silvana Rivera", status: "present", note: "" },
  { name: "Sharito Ramos", status: "present", note: "" },
  { name: "Sofía Quiroz", status: "present", note: "" },
  { name: "Steven Galarreta", status: "present", note: "" },
  { name: "Valeri Guevara", status: "present", note: "" },
  { name: "Valeria Fernandez", status: "present", note: "" },
  { name: "Victor Angel Aguilar", status: "present", note: "" },
  { name: "Xiomara Chacón", status: "present", note: "" },
  { name: "Estefany Castillo", status: "present", note: "" }
];

const labels = { present: "Presente", absent: "Ausente", late: "Tardanza" };
const icons = { present: "✓", absent: "×", late: "◷" };
const table = document.querySelector("#member-table");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
const attendanceView = document.querySelector("#attendance-view");
const membersView = document.querySelector("#members-view");
const reportsView = document.querySelector("#reports-view");
const reportMonthTrigger = document.querySelector("#report-month-trigger");
const monthPicker = document.querySelector("#month-picker");
const monthPickerYear = document.querySelector("#month-picker-year");
const monthGrid = document.querySelector("#month-grid");
let reportMonthValue = "";
let pickerYear = new Date().getFullYear();
const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const monthlyRecords = {};
let hasUnsavedChanges = false;
let modalMemberIndex = -1;
let modalMode = "edit";
let justificationMemberIndex = -1;
let pendingStatus = "";

function getMonthKey(dateValue) {
  return dateValue.slice(0, 7);
}

function createRecordsFromMembers() {
  return members.map((member) => ({ status: member.status, justification: member.justification || null }));
}

function getMonthRecords(monthKey) {
  if (!monthlyRecords[monthKey]) {
    monthlyRecords[monthKey] = monthKey === "2026-09"
      ? createRecordsFromMembers()
      : members.map(() => ({ status: null, justification: null }));
  }
  return monthlyRecords[monthKey];
}

function getAttendanceRecords() {
  return getMonthRecords(getMonthKey(document.querySelector("#attendance-date").value));
}

function renderMonthPicker() {
  monthPickerYear.textContent = pickerYear;
  monthGrid.innerHTML = monthNames.map((month, index) => {
    const value = `${pickerYear}-${String(index + 1).padStart(2, "0")}`;
    const selected = value === reportMonthValue ? "selected" : "";
    return `<button class="month-option ${selected}" type="button" data-month-value="${value}">${month}</button>`;
  }).join("");
}

function renderMembers() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const records = getAttendanceRecords();
  const visibleMembers = members.filter((member) => member.name.toLocaleLowerCase().includes(query));
  table.innerHTML = visibleMembers.map((member) => {
    const memberIndex = members.indexOf(member);
    const record = records[memberIndex];
    const justification = record.status !== "present" && record.justification ? `<small>${record.justification === "justified" ? "Justificada" : "Injustificada"}</small>` : "";
    return `<tr>
      <td>${member.name}</td>
      <td><div class="status-actions">${Object.keys(labels).map((status) => `<button class="state-button ${status} ${record.status === status ? "selected" : ""}" data-index="${memberIndex}" data-status="${status}" type="button"><span>${icons[status]}</span>${labels[status]}${record.status === status ? justification : ""}</button>`).join("")}</div></td>
      <td><div class="row-actions"><button class="row-action" type="button" data-action="edit" data-index="${memberIndex}"><span>✎</span>Editar</button><button class="row-action" type="button" data-action="qr" data-index="${memberIndex}"><span>⬚</span>QR</button></div></td>
    </tr>`;
  }).join("");
  emptyState.hidden = visibleMembers.length !== 0;
  document.querySelector("#member-count").textContent = visibleMembers.length;
  updateSummary(records);
}

function updateSummary(records = getAttendanceRecords()) {
  const totals = records.reduce((summary, record) => { if (record.status) summary[record.status] += 1; return summary; }, { present: 0, absent: 0, late: 0 });
  document.querySelector("#present-count").textContent = totals.present;
  document.querySelector("#absent-count").textContent = totals.absent;
  document.querySelector("#late-count").textContent = totals.late;
}

function renderDirectory() {
  document.querySelector("#directory-count").textContent = members.length;
  document.querySelector("#directory-list").innerHTML = members.map((member, index) => `
    <article class="directory-item">
      <span class="directory-number">${String(index + 1).padStart(2, "0")}</span>
      <div><strong>${member.name}</strong></div>
      <div class="directory-actions">
        <button class="row-action" type="button" data-directory-action="edit" data-directory-index="${index}"><span>✎</span>Editar</button>
        <button class="row-action remove-action" type="button" data-directory-action="remove" data-directory-index="${index}"><span>×</span>Quitar</button>
      </div>
    </article>`).join("");
}

function renderReport() {
  const date = reportMonthValue ? new Date(`${reportMonthValue}-01T12:00:00`) : new Date();
  const records = getMonthRecords(reportMonthValue);
  const monthName = date.toLocaleDateString("es-PE", { month: "long" }).toUpperCase();
  document.querySelector("#report-title").textContent = `REPORTE MENSUAL ${monthName}`;
  document.querySelector("#report-period").textContent = monthName;
  const totals = records.reduce((summary, record) => {
    if (record.status) summary[record.status] += 1;
    return summary;
  }, { present: 0, absent: 0, late: 0 });
  document.querySelector("#report-summary").innerHTML = [
    ["Presentes", totals.present, "present"],
    ["Ausentes", totals.absent, "absent"],
    ["Tardanzas", totals.late, "late"]
  ].map(([label, value, type]) => `<div class="report-card"><span class="legend-dot ${type}"></span><strong>${value}</strong><span>${label}</span></div>`).join("");
  document.querySelector("#report-table").innerHTML = members.map((member, index) => {
    const record = records[index];
    const justification = !record.status || record.status === "present" ? "-" : record.justification === "justified" ? "Justificada" : record.justification === "unjustified" ? "Injustificada" : "Pendiente";
    return `<tr><td>${member.name}</td><td>${record.status === "present" ? 1 : 0}</td><td>${record.status === "absent" ? 1 : 0}</td><td>${record.status === "late" ? 1 : 0}</td><td>${justification}</td></tr>`;
  }).join("");
}

function escapeSpreadsheetValue(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function downloadReport() {
  const date = new Date(`${reportMonthValue}-01T12:00:00`);
  const monthName = date.toLocaleDateString("es-PE", { month: "long" }).toUpperCase();
  const records = getMonthRecords(reportMonthValue);
  const totals = records.reduce((summary, record) => {
    if (record.status) summary[record.status] += 1;
    return summary;
  }, { present: 0, absent: 0, late: 0 });
  const rows = members.map((member, index) => {
    const record = records[index];
    const status = record.status ? labels[record.status] : "Sin registro";
    const justification = record.status === "present" || !record.status ? "-" : record.justification === "justified" ? "Justificada" : record.justification === "unjustified" ? "Injustificada" : "Pendiente";
    return `<tr><td>${escapeSpreadsheetValue(member.name)}</td><td>${status}</td><td>${record.status === "present" ? "Sí" : "No"}</td><td>${record.status === "absent" ? "Sí" : "No"}</td><td>${record.status === "late" ? "Sí" : "No"}</td><td>${justification}</td></tr>`;
  }).join("");
  const spreadsheet = `<html><head><meta charset="UTF-8"><style>body{font-family:Arial;color:#111}h1{color:#b88918}table{border-collapse:collapse}th,td{border:1px solid #999;padding:8px}th{background:#e5bd43}td{mso-number-format:\@}</style></head><body><h1>REPORTE MENSUAL ${monthName}</h1><p>Presentes: ${totals.present} | Ausentes: ${totals.absent} | Tardanzas: ${totals.late}</p><table><thead><tr><th>Integrante</th><th>Estado</th><th>Presente</th><th>Ausente</th><th>Tardanza</th><th>Justificación</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const blob = new Blob(["\ufeff", spreadsheet], { type: "application/vnd.ms-excel" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `reporte-${monthName.toLocaleLowerCase("es-PE")}.xls`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
  document.querySelector("#report-download-status").textContent = "Excel descargado correctamente";
  showToast(`Reporte de ${monthName.toLowerCase()} descargado.`);
}

function moveReportMonth(offset) {
  const date = new Date(`${reportMonthValue}-01T12:00:00`);
  date.setMonth(date.getMonth() + offset);
  setReportMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  renderReport();
}

function setReportMonth(value) {
  reportMonthValue = value;
  const date = new Date(`${value}-01T12:00:00`);
  pickerYear = date.getFullYear();
  reportMonthTrigger.textContent = date.toLocaleDateString("es-PE", { month: "long" }).toUpperCase();
  renderMonthPicker();
}

function closeMonthPicker() {
  monthPicker.hidden = true;
  reportMonthTrigger.setAttribute("aria-expanded", "false");
}

function showView(viewName) {
  const views = { Asistencia: attendanceView, Miembros: membersView, Reportes: reportsView };
  Object.entries(views).forEach(([name, view]) => { view.hidden = name !== viewName; });
  if (viewName === "Miembros") renderDirectory();
  if (viewName === "Reportes") renderReport();
}

function markChanged() {
  hasUnsavedChanges = true;
  document.querySelector("#save-message").textContent = "Cambios sin guardar";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function openMemberModal(index, mode) {
  const member = mode === "add" ? { name: "", note: "" } : members[index];
  modalMemberIndex = index;
  modalMode = mode;
  document.querySelector("#modal-title").textContent = mode === "add" ? "Agregar integrante" : mode === "edit" ? "Editar integrante" : "Notas del integrante";
  document.querySelector("#name-field").hidden = mode === "note";
  document.querySelector("#note-field").hidden = mode !== "note";
  document.querySelector("#modal-name").value = member.name;
  document.querySelector("#modal-note").value = member.note;
  document.querySelector("#member-modal").hidden = false;
  (mode === "note" ? document.querySelector("#modal-note") : document.querySelector("#modal-name")).focus();
}

function closeMemberModal() {
  document.querySelector("#member-modal").hidden = true;
  modalMemberIndex = -1;
}

function openJustificationModal(index, status) {
  justificationMemberIndex = index;
  pendingStatus = status;
  document.querySelector("#justification-title").textContent = `${labels[status]}: justificación`;
  document.querySelector("#justification-copy").textContent = `Selecciona si la ${labels[status].toLowerCase()} de ${members[index].name} está justificada.`;
  document.querySelector("#justification-modal").hidden = false;
}

function closeJustificationModal() {
  justificationModal.hidden = true;
}

function openQrModal(index) {
  const modal = document.querySelector("#qr-modal");
  const member = members[index];
  document.querySelector("#qr-title").textContent = `QR: ${member.name}`;
  const container = document.querySelector("#qr-container");
  container.innerHTML = "";
  new QRCode(container, {
    text: member.name,
    width: 200,
    height: 200
  });
  modal.hidden = false;
}

function closeQrModal() {
  document.querySelector("#qr-modal").hidden = true;
}

function openQrScanner() {
  const modal = document.querySelector("#qr-scanner-modal");
  modal.hidden = false;
  
  html5QrCodeScanner = new Html5Qrcode("qr-reader");
  html5QrCodeScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      onScanSuccess(decodedText);
    },
    (errorMessage) => {
      // ignore
    }
  ).catch((err) => {
    console.error(err);
    showToast("No se pudo iniciar la cámara.");
  });
}

function closeQrScanner() {
  if (html5QrCodeScanner) {
    html5QrCodeScanner.stop().then(() => {
        document.querySelector("#qr-scanner-modal").hidden = true;
    }).catch((err) => {
        console.error(err);
        document.querySelector("#qr-scanner-modal").hidden = true;
    });
  }
}

function onScanSuccess(decodedText) {
  closeQrScanner();
  const memberName = decodedText.trim();
  const index = members.findIndex(m => m.name.toLowerCase() === memberName.toLowerCase());
  
  if (index === -1) {
    showToast("Integrante no encontrado.");
    return;
  }
  
  // Show options for status
  pendingStatus = "";
  justificationMemberIndex = index;
  // Use a simple prompt for now, or build another modal if needed, 
  // but for now let's use the justification modal logic to ask status first?
  // User asked for "Presente o Tardanza".
  if (window.confirm(`¿Marcar como Presente a ${members[index].name}?`)) {
      updateStatus(index, "present");
  } else if (window.confirm(`¿Marcar como Tardanza a ${members[index].name}?`)) {
      openJustificationModal(index, "late");
  }
}

function updateStatus(index, status) {
    const records = getAttendanceRecords();
    records[index].status = status;
    records[index].justification = null;
    markChanged();
    renderMembers();
    showToast(`${members[index].name} marcado como ${labels[status]}.`);
}

table.addEventListener("click", (event) => {
  const stateButton = event.target.closest("[data-status]");
  if (stateButton) {
    const index = Number(stateButton.dataset.index);
    const status = stateButton.dataset.status;
    if (status !== "present") {
      openJustificationModal(index, status);
      return;
    }
    const records = getAttendanceRecords();
    records[index].status = status;
    records[index].justification = null;
    markChanged();
    renderMembers();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "edit") {
    openMemberModal(Number(action.dataset.index), "edit");
    return;
  }
  openQrModal(Number(action.dataset.index));
});

searchInput.addEventListener("input", renderMembers);
document.querySelector("#save-button").addEventListener("click", () => {
  hasUnsavedChanges = false;
  document.querySelector("#save-message").textContent = "Asistencia guardada";
  showToast("La asistencia se guardó correctamente.");
});
document.querySelector(".filter-button").addEventListener("click", () => {
  const eventName = document.querySelector("#event-select").value;
  showToast(`Vista filtrada: ${eventName}.`);
});
document.querySelectorAll(".nav-item").forEach((navButton) => {
  navButton.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    navButton.classList.add("active");
    showView(navButton.textContent.trim());
  });
});
document.querySelector("#directory-list").addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-directory-action]");
  if (!actionButton) return;
  const index = Number(actionButton.dataset.directoryIndex);
  if (actionButton.dataset.directoryAction === "remove") {
    if (!window.confirm(`¿Quitar a ${members[index].name} de la lista?`)) return;
    members.splice(index, 1);
    Object.values(monthlyRecords).forEach((records) => records.splice(index, 1));
    renderMembers();
    renderDirectory();
    markChanged();
    showToast("Integrante quitado de la lista.");
    return;
  }
  openMemberModal(index, "edit");
});
document.querySelector("#add-member-button").addEventListener("click", () => openMemberModal(-1, "add"));
document.querySelector("#previous-month").addEventListener("click", () => moveReportMonth(-1));
document.querySelector("#next-month").addEventListener("click", () => moveReportMonth(1));
document.querySelector("#download-report").addEventListener("click", downloadReport);
reportMonthTrigger.addEventListener("click", () => {
  monthPicker.hidden = !monthPicker.hidden;
  reportMonthTrigger.setAttribute("aria-expanded", String(!monthPicker.hidden));
  renderMonthPicker();
});
monthGrid.addEventListener("click", (event) => {
  const option = event.target.closest("[data-month-value]");
  if (!option) return;
  setReportMonth(option.dataset.monthValue);
  renderReport();
  closeMonthPicker();
});
document.querySelector("#previous-year").addEventListener("click", () => { pickerYear -= 1; renderMonthPicker(); });
document.querySelector("#next-year").addEventListener("click", () => { pickerYear += 1; renderMonthPicker(); });
document.querySelector("#member-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#modal-name").value.trim();
  if (modalMode === "add") {
    members.push({ name, status: "present", justification: null, note: "" });
    Object.values(monthlyRecords).forEach((records) => records.push({ status: null, justification: null }));
    renderMembers();
    renderDirectory();
    showToast("Integrante agregado correctamente.");
  } else if (modalMode === "edit") {
    const member = members[modalMemberIndex];
    member.name = name || member.name;
    renderMembers();
    renderDirectory();
    showToast("Datos del integrante actualizados.");
  } else {
    const member = members[modalMemberIndex];
    member.note = document.querySelector("#modal-note").value.trim();
    showToast(member.note ? "Nota guardada correctamente." : "Nota eliminada.");
  }
  markChanged();
  closeMemberModal();
});
document.querySelector("#modal-close").addEventListener("click", closeMemberModal);
document.querySelector("#modal-cancel").addEventListener("click", closeMemberModal);
document.querySelector("#member-modal").addEventListener("click", (event) => { if (event.target.id === "member-modal") closeMemberModal(); });
document.querySelectorAll("[data-justification]").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedStatus = pendingStatus;
    const records = getAttendanceRecords();
    records[justificationMemberIndex].status = selectedStatus;
    records[justificationMemberIndex].justification = button.dataset.justification;
    markChanged();
    renderMembers();
    closeJustificationModal();
    showToast(`${labels[selectedStatus]} marcada como ${button.textContent.toLowerCase()}.`);
  });
});
document.querySelector("#justification-close").addEventListener("click", closeJustificationModal);
document.querySelector("#justification-modal").addEventListener("click", (event) => { if (event.target.id === "justification-modal") closeJustificationModal(); });
document.querySelector("#qr-close").addEventListener("click", closeQrModal);
document.querySelector("#qr-modal").addEventListener("click", (event) => { if (event.target.id === "qr-modal") closeQrModal(); });
document.querySelector("#attendance-date").addEventListener("change", (event) => {
  const date = new Date(`${event.target.value}T12:00:00`);
  document.querySelector("#current-date").textContent = date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "").toUpperCase();
  renderMembers();
  markChanged();
});
window.addEventListener("beforeunload", (event) => { if (hasUnsavedChanges) event.preventDefault(); });
const today = new Date();
const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
setReportMonth(todayValue.slice(0, 7));
document.querySelector("#attendance-date").value = todayValue;
document.querySelector("#attendance-date").dispatchEvent(new Event("change"));
hasUnsavedChanges = false;
document.querySelector("#save-message").textContent = "Registro del día listo";
renderMembers();
