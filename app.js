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
const reportMonthTrigger = document.querySelector("#report-date-trigger");
const monthPicker = document.querySelector("#calendar-picker");
const monthPickerYear = document.querySelector("#calendar-label");
const monthGrid = document.querySelector("#calendar-grid");
let reportMonthValue = "";
let pickerYear = new Date().getFullYear();
const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const monthlyRecords = {};
const dailyRecords = {};
const STORAGE_KEY = "melodias-asistencia-data-v1";
const initialAttendanceDate = new Date().toISOString().slice(0, 10);
let hasUnsavedChanges = false;
let modalMemberIndex = -1;
let modalMode = "edit";
let justificationMemberIndex = -1;
let pendingStatus = "";
let qrAttendanceMemberIndex = -1;
let qrAttendanceStatus = "";
let html5QrCodeScanner = null;
let isQrScannerStarting = false;
let isQrCodeDetected = false;
let resumeQrScannerAfterAttendance = false;

function getMonthKey(dateValue) {
  return dateValue.slice(0, 7);
}

function persistData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ members, dailyRecords }));
}

function clearAttendanceRecords() {
  Object.keys(dailyRecords).forEach((dateValue) => delete dailyRecords[dateValue]);
  persistData();
}

function restoreData() {
  try {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!savedData) return;
    if (Array.isArray(savedData.members)) {
      members.splice(0, members.length, ...savedData.members);
    }
    if (savedData.dailyRecords && typeof savedData.dailyRecords === "object") {
      Object.entries(savedData.dailyRecords).forEach(([dateValue, records]) => {
        if (!Array.isArray(records)) return;
        dailyRecords[dateValue] = members.map((_, index) => records[index] || ({ status: null, justification: null }));
      });
    }
  } catch (error) {
    console.warn("No se pudieron restaurar los datos guardados.", error);
  }
}

function createRecordsFromMembers() {
  return members.map((member) => ({ status: member.status, justification: member.justification || null }));
}

function getMonthRecords(monthKey) {
  if (!monthlyRecords[monthKey]) {
    monthlyRecords[monthKey] = members.map(() => ({ status: null, justification: null }));
  }
  return monthlyRecords[monthKey];
}

function getSelectedEvent() {
  return document.querySelector("#event-select")?.value || "Ensayo General";
}

function getEventRecordKey(dateValue, eventName = getSelectedEvent()) {
  return `${dateValue}::${eventName}`;
}

function createEmptyRecords() {
  return members.map(() => ({ status: null, justification: null }));
}

function getDailyRecords(dateValue, eventName = getSelectedEvent()) {
  const recordKey = getEventRecordKey(dateValue, eventName);
  if (!dailyRecords[recordKey]) {
    return createEmptyRecords();
  }
  dailyRecords[recordKey] = members.map((_, index) => dailyRecords[recordKey][index] || ({ status: null, justification: null }));
  return dailyRecords[recordKey];
}

function getAttendanceRecords() {
  const dateValue = document.querySelector("#attendance-date").value;
  const eventName = getSelectedEvent();
  const recordKey = getEventRecordKey(dateValue, eventName);
  if (!dailyRecords[recordKey]) {
    dailyRecords[recordKey] = createEmptyRecords();
  }
  return getDailyRecords(dateValue, eventName);
}

function renderMonthPicker() {
  if (!monthPickerYear || !monthGrid) return;
  monthPickerYear.textContent = new Date(`${pickerYear}-${String(Number(reportMonthValue.slice(5, 7) || 1)).padStart(2, "0")}-01T12:00:00`).toLocaleDateString("es-PE", { month: "long", year: "numeric" }).toUpperCase();
  renderCalendar();
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
  const dateValue = document.querySelector("#report-date-value").value || new Date().toISOString().slice(0, 10);
  const date = new Date(`${dateValue}T12:00:00`);
  const dayName = date.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  const monthName = date.toLocaleDateString("es-PE", { month: "long", year: "numeric" }).toUpperCase();
  document.querySelector("#report-title").textContent = `REPORTE MENSUAL ${monthName}`;
  document.querySelector("#report-period").textContent = monthName;
  document.querySelector("#report-date-trigger").textContent = monthName;

  const records = getAttendanceRecordsForDate(dateValue, getSelectedEvent());
  const eventName = getSelectedEvent();
  document.querySelector("#report-title").textContent = `REPORTE ${eventName.toUpperCase()} - ${monthName}`;
  
  const totals = records.reduce((summary, record) => {                
    if (record.status) summary[record.status] += 1;
    return summary;
  }, { present: 0, absent: 0, late: 0 });
  const unjustifiedLate = records.filter((record) => record.status === "late" && record.justification === "unjustified").length;
  const unjustifiedAbsent = records.filter((record) => record.status === "absent" && record.justification === "unjustified").length;
  const accumulatedPayments = getAccumulatedPaymentTotals();
  const latePayment = accumulatedPayments.late;
  const absentPayment = accumulatedPayments.absent;

  document.querySelector("#report-summary").innerHTML = [
    ["Presentes", totals.present, "present"],
    ["Ausentes", totals.absent, "absent"],
    ["Tardanzas", totals.late, "late"]
  ].map(([label, value, type]) => `<div class="report-card"><span class="legend-dot ${type}"></span><strong>${value}</strong><span>${label}</span></div>`).join("");
  document.querySelector("#late-payment-total").textContent = `S/ ${latePayment.toFixed(2)}`;
  document.querySelector("#absent-payment-total").textContent = `S/ ${absentPayment.toFixed(2)}`;
  document.querySelector("#payment-total").textContent = `S/ ${(latePayment + absentPayment).toFixed(2)}`;

  document.querySelector("#report-table").innerHTML = members.map((member, index) => {
    const record = records[index] || { status: null, justification: null };
    const justification = !record.status || record.status === "present" ? "-" : record.justification === "justified" ? "Justificada" : record.justification === "unjustified" ? "Injustificada" : "Pendiente";
    const latePayment = record.status === "late" && record.justification === "unjustified" ? "S/ 5.00" : "-";
    const absentPayment = record.status === "absent" && record.justification === "unjustified" ? "S/ 10.00" : "-";
    return `<tr><td>${member.name}</td><td>${record.status === "present" ? 1 : 0}</td><td>${record.status === "absent" ? 1 : 0}</td><td>${record.status === "late" ? 1 : 0}</td><td>${justification}</td><td>${latePayment}</td><td>${absentPayment}</td></tr>`;
  }).join("");
}

function getAttendanceRecordsForDate(dateValue, eventName = getSelectedEvent()) {
  return getDailyRecords(dateValue, eventName);
}

function getAccumulatedPaymentTotals() {
  return Object.entries(dailyRecords).reduce((totals, [recordKey, records]) => {
    const eventName = recordKey.split("::").slice(1).join("::");
    if (!eventName || !Array.isArray(records)) return totals;
    records.forEach((record) => {
      if (record.status === "late" && record.justification === "unjustified") totals.late += 5;
      if (record.status === "absent" && record.justification === "unjustified") totals.absent += 10;
    });
    return totals;
  }, { late: 0, absent: 0 });
}

function escapeSpreadsheetValue(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function downloadReport() {
  const monthKey = reportMonthValue || document.querySelector("#report-date-value").value.slice(0, 7);
  const monthDate = new Date(`${monthKey}-01T12:00:00`);
  const monthName = monthDate.toLocaleDateString("es-PE", { month: "long", year: "numeric" }).toUpperCase();
  const eventNames = ["Ensayo General", "Ensayo Ballet"];
  const recordedKeys = Object.keys(dailyRecords)
    .filter((recordKey) => recordKey.startsWith(`${monthKey}-`))
    .sort();
  const recordEntries = recordedKeys.length
    ? recordedKeys.map((recordKey) => {
      const [dateValue, ...eventParts] = recordKey.split("::");
      return { dateValue, eventName: eventParts.join("::") || "Ensayo General" };
    })
    : [{ dateValue: document.querySelector("#report-date-value").value, eventName: getSelectedEvent() }];
  const detailRows = recordEntries.flatMap(({ dateValue, eventName }) => {
    const dateLabel = new Date(`${dateValue}T12:00:00`).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    return getDailyRecords(dateValue, eventName).map((record, index) => {
      const justification = !record.status || record.status === "present" ? "-" : record.justification === "justified" ? "Justificada" : record.justification === "unjustified" ? "Injustificada" : "Pendiente";
      const latePayment = record.status === "late" && record.justification === "unjustified" ? "S/ 5.00" : "-";
      const absentPayment = record.status === "absent" && record.justification === "unjustified" ? "S/ 10.00" : "-";
      return `<tr><td>${dateLabel}</td><td>${escapeSpreadsheetValue(monthName)}</td><td>${escapeSpreadsheetValue(eventName)}</td><td>${escapeSpreadsheetValue(members[index]?.name || "")}</td><td>${record.status ? labels[record.status] : "Sin registro"}</td><td>${justification}</td><td>${latePayment}</td><td>${absentPayment}</td></tr>`;
    });
  }).join("");
  const summary = members.map((member, index) => {
    const totals = recordEntries.reduce((result, { dateValue, eventName }) => {
      const record = getDailyRecords(dateValue, eventName)[index] || {};
      if (record.status) result[record.status] += 1;
      return result;
    }, { present: 0, absent: 0, late: 0 });
    const latePayments = recordEntries.reduce((total, { dateValue, eventName }) => {
      const record = getDailyRecords(dateValue, eventName)[index] || {};
      return total + (record.status === "late" && record.justification === "unjustified" ? 5 : 0);
    }, 0);
    const absentPayments = recordEntries.reduce((total, { dateValue, eventName }) => {
      const record = getDailyRecords(dateValue, eventName)[index] || {};
      return total + (record.status === "absent" && record.justification === "unjustified" ? 10 : 0);
    }, 0);
    return `<tr><td>${escapeSpreadsheetValue(member.name)}</td><td>${totals.present}</td><td>${totals.absent}</td><td>${totals.late}</td><td>${totals.present + totals.absent + totals.late}</td><td>S/ ${latePayments.toFixed(2)}</td><td>S/ ${absentPayments.toFixed(2)}</td></tr>`;
  }).join("");
  const spreadsheet = `<html><head><meta charset="UTF-8"><style>body{font-family:Arial;color:#111}h1{color:#b88918}h2{color:#555;margin-top:28px}table{border-collapse:collapse;margin-bottom:18px}th,td{border:1px solid #999;padding:8px}th{background:#e5bd43}td{mso-number-format:\@}</style></head><body><h1>REPORTE DE ASISTENCIA - ${escapeSpreadsheetValue(monthName)}</h1><h2>Detalle por día</h2><table><thead><tr><th>Día del registro</th><th>Mes</th><th>Ensayo</th><th>Integrante</th><th>Estado</th><th>Justificación</th><th>Pago tardanza</th><th>Pago ausencia</th></tr></thead><tbody>${detailRows}</tbody></table><h2>Reporte general de integrantes</h2><table><thead><tr><th>Integrante</th><th>Presentes</th><th>Ausentes</th><th>Tardanzas</th><th>Total de registros</th><th>Pago tardanza</th><th>Pago ausencia</th></tr></thead><tbody>${summary}</tbody></table></body></html>`;
  const blob = new Blob(["\ufeff", spreadsheet], { type: "application/vnd.ms-excel;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `reporte-asistencia-${monthKey}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  document.querySelector("#report-download-status").textContent = "Excel descargado correctamente";
  showToast("Reporte detallado descargado correctamente.");
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
  if (reportMonthTrigger) {
    reportMonthTrigger.textContent = date.toLocaleDateString("es-PE", { month: "long", year: "numeric" }).toUpperCase();
  }
  renderMonthPicker();
}

function closeMonthPicker() {
  monthPicker.hidden = true;
  reportMonthTrigger.setAttribute("aria-expanded", "false");
}

function showView(viewName) {
  checkAutomaticAbsences(); // Verificación al cambiar de vista
  const views = { Asistencia: attendanceView, Miembros: membersView, Reportes: reportsView };
  Object.entries(views).forEach(([name, view]) => { view.hidden = name !== viewName; });
  if (viewName === "Miembros") renderDirectory();
  if (viewName === "Reportes") renderReport();
}

function markChanged() {
  hasUnsavedChanges = true;
  persistData();
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
  const modal = document.querySelector("#justification-modal");
  if (modal) modal.hidden = true;
  justificationMemberIndex = -1;
  pendingStatus = "";
}

function openQrModal(index) {
  const modal = document.querySelector("#qr-modal");
  const member = members[index];
  document.querySelector("#qr-title").textContent = `QR: ${member.name}`;
  const container = document.querySelector("#qr-container");
  container.innerHTML = "";
  new QRCode(container, {
    text: `melodias://integrante/${index}/${encodeURIComponent(member.name)}`,
    width: 240,
    height: 240,
    correctLevel: QRCode.CorrectLevel.H
  });
  modal.hidden = false;
}

function closeQrModal() {
  document.querySelector("#qr-modal").hidden = true;
}

function openQrAttendanceModal(memberIndex) {
  qrAttendanceMemberIndex = memberIndex;
  qrAttendanceStatus = "";
  document.querySelector("#qr-attendance-title").textContent = `Asistencia: ${members[memberIndex].name}`;
  document.querySelector("#qr-justification-options").hidden = true;
  document.querySelector("#qr-attendance-modal").hidden = false;
}

function closeQrAttendanceModal() {
  document.querySelector("#qr-attendance-modal").hidden = true;
  qrAttendanceMemberIndex = -1;
  qrAttendanceStatus = "";
}

function finishQrAttendance(message) {
  persistData();
  renderMembers();
  closeQrAttendanceModal();
  showToast(message);
  if (resumeQrScannerAfterAttendance) {
    resumeQrScannerAfterAttendance = false;
    window.setTimeout(() => openQrScanner(), 250);
  }
}

function normalizeQrValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function decodeQrText(value) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

async function onScanSuccess(decodedText) {
  if (isQrCodeDetected) return;
  isQrCodeDetected = true;
  const scannedValue = decodeQrText(String(decodedText).trim());
  let memberIndex = members.findIndex((member) => normalizeQrValue(member.name) === normalizeQrValue(scannedValue));
  const qrMatch = scannedValue.match(/^(?:melodias:\/\/integrante\/|https?:\/\/[^/]+\/integrante\/)(\d+)(?:\/([^/?#]+))?/i);
  if (memberIndex < 0 && qrMatch) {
    const indexFromQr = Number(qrMatch[1]);
    const nameFromQr = decodeQrText(qrMatch[2] || "");
    const member = members[indexFromQr];
    if (member && (!nameFromQr || normalizeQrValue(member.name) === normalizeQrValue(nameFromQr))) {
      memberIndex = indexFromQr;
    }
  }
  if (memberIndex < 0) {
    isQrCodeDetected = false;
    showToast(`QR no reconocido: ${scannedValue.slice(0, 40)}`);
    return;
  }
  resumeQrScannerAfterAttendance = true;
  await closeQrScanner();
  openQrAttendanceModal(memberIndex);
}

async function openQrScanner() {
  const modal = document.querySelector("#qr-scanner-modal");
  modal.hidden = false;

  if (typeof Html5Qrcode === "undefined") {
    await closeQrScanner();
    showToast("No se pudo cargar el lector QR.");
    return;
  }
  if (isQrScannerStarting || html5QrCodeScanner) return;

  isQrScannerStarting = true;
  isQrCodeDetected = false;
  const reader = document.querySelector("#qr-reader");
  reader.innerHTML = "";
  const scanner = new Html5Qrcode("qr-reader", { verbose: false });
  html5QrCodeScanner = scanner;
  const scanConfig = {
    fps: 12,
    qrbox: { width: 260, height: 260 },
    aspectRatio: 1,
    disableFlip: false
  };

  try {
    // Se intenta primero la cámara trasera; si no existe, la librería elegirá una disponible.
    await scanner.start(
      { facingMode: { exact: "environment" } },
      scanConfig,
      onScanSuccess,
      () => {}
    );
    showToast("Cámara lista. Centra el código QR en el recuadro.");
  } catch (rearCameraError) {
    try {
      await scanner.start(
        { facingMode: "environment" },
        scanConfig,
        onScanSuccess,
        () => {}
      );
      showToast("Cámara lista. Centra el código QR en el recuadro.");
    } catch (cameraError) {
      console.warn("No se pudo iniciar el lector QR.", rearCameraError, cameraError);
      await closeQrScanner();
      showToast("No se pudo iniciar el lector QR. Permite la cámara y usa HTTPS o localhost.");
    }
  } finally {
    isQrScannerStarting = false;
  }
}

async function closeQrScanner() {
  const modal = document.querySelector("#qr-scanner-modal");
  if (modal) modal.hidden = true;
  isQrCodeDetected = false;
  if (html5QrCodeScanner) {
    const scanner = html5QrCodeScanner;
    html5QrCodeScanner = null;
    try {
      await scanner.stop();
    } catch (e) {
      console.warn("No se pudo detener la cámara QR:", e);
    } finally {
      try { scanner.clear(); } catch (e) {}
    }
  }
}

let currentCalendarDate = new Date();

function renderCalendar() {
  const calendarLabel = document.querySelector("#calendar-label");
  const calendarGrid = document.querySelector("#calendar-grid");
  if (!calendarLabel || !calendarGrid) return;
  
  calendarLabel.textContent = currentCalendarDate.toLocaleDateString("es-PE", { month: "long", year: "numeric" }).toUpperCase();
  
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Lunes=0, Domingo=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  calendarGrid.innerHTML = "";
  
  // Encabezados de días (L M M J V S D)
  const dayHeaders = ["L", "M", "M", "J", "V", "S", "D"];
  dayHeaders.forEach((d) => {
    const h = document.createElement("div");
    h.className = "calendar-day-header";
    h.textContent = d;
    calendarGrid.appendChild(h);
  });

  // Celdas vacías antes del primer día del mes
  for (let i = 0; i < startOffset; i++) {
    const emptyCell = document.createElement("div");
    calendarGrid.appendChild(emptyCell);
  }
  
  const selectedDateVal = document.querySelector("#report-date-value").value;
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    
    const button = document.createElement("button");
    button.className = "calendar-day-btn";
    button.textContent = day;
    button.type = "button";
    
    if (dateString === selectedDateVal) {
      button.classList.add("selected");
    }
    if (dateString === todayFormatted) {
      button.classList.add("today");
    }
    
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const attendanceDate = document.querySelector("#attendance-date");
      const reportDate = document.querySelector("#report-date-value");
      reportDate.value = dateString;
      attendanceDate.value = dateString;
      currentCalendarDate = new Date(year, month, day);
      setReportMonth(`${year}-${formattedMonth}`);
      attendanceDate.dispatchEvent(new Event("change"));
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelector('.nav-item:nth-of-type(1)').classList.add("active");
      showView("Asistencia");
      calendarPicker.hidden = true;
      calendarPicker.setAttribute("hidden", "");
      reportDateTrigger.setAttribute("aria-expanded", "false");
      showToast(`Registro del ${currentCalendarDate.toLocaleDateString("es-PE", { day: "numeric", month: "long" })} seleccionado.`);
    });
    
    calendarGrid.appendChild(button);
  }
}

function checkAutomaticAbsences() {
    const now = new Date();
    // Si ya son las 21:00 (9 PM) o más
    if (now.getHours() >= 21) {
        const records = getAttendanceRecords();
        let changed = false;
        members.forEach((member, index) => {
            if (!records[index].status) {
                records[index].status = "absent";
                records[index].justification = "unjustified";
                changed = true;
            }
        });
        if (changed) {
            markChanged();
            renderMembers();
            showToast("Integrantes sin registro marcados como ausentes automáticamente.");
        }
    }
}
// Verificar al cargar y en cada cambio de vista
window.addEventListener('load', () => {
    restoreData();
    checkAutomaticAbsences();
    // Inicializar picker de fecha
    const today = new Date().toISOString().slice(0, 10);
    document.querySelector("#report-date-value").value = today;
    document.querySelector("#attendance-date").value = today;
    renderReport();
    renderMembers();
});

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
document.querySelector("#scan-qr-button").addEventListener("click", openQrScanner);
document.querySelectorAll("[data-qr-status]").forEach((button) => {
  button.addEventListener("click", () => {
    qrAttendanceStatus = button.dataset.qrStatus;
    if (qrAttendanceStatus === "present") {
      const records = getAttendanceRecords();
      records[qrAttendanceMemberIndex] = { status: "present", justification: null };
      finishQrAttendance("Asistencia registrada como presente. Puedes escanear nuevamente.");
      return;
    }
    document.querySelector("#qr-justification-options").hidden = false;
  });
});
document.querySelectorAll("[data-qr-justification]").forEach((button) => {
  button.addEventListener("click", () => {
    const records = getAttendanceRecords();
    records[qrAttendanceMemberIndex] = { status: qrAttendanceStatus, justification: button.dataset.qrJustification };
    finishQrAttendance("Asistencia registrada. Puedes escanear nuevamente.");
  });
});
document.querySelector("#save-button").addEventListener("click", () => {
  persistData();
  hasUnsavedChanges = false;
  document.querySelector("#save-message").textContent = "Asistencia guardada";
  showToast("La asistencia se guardó correctamente.");
});
document.querySelector("#download-report").addEventListener("click", downloadReport);
document.querySelector(".filter-button").addEventListener("click", () => {
  const eventName = document.querySelector("#event-select").value;
  showToast(`Vista filtrada: ${eventName}.`);
});
document.querySelector("#event-select").addEventListener("change", () => {
  renderMembers();
  renderReport();
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
// Actualizar reporte al cambiar la fecha
document.querySelector("#report-date-value").addEventListener("change", renderReport);

// Selector de calendario y navegación
const reportDateTrigger = document.querySelector("#report-date-trigger");
const calendarPicker = document.querySelector("#calendar-picker");
const prevMonthBtn = document.querySelector("#prev-month-btn");
const nextMonthBtn = document.querySelector("#next-month-btn");

if (reportDateTrigger && calendarPicker) {
  const toggleCalendar = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const shouldOpen = calendarPicker.hidden;
    if (shouldOpen) {
      const curVal = document.querySelector("#report-date-value").value;
      if (curVal) {
        const [y, m, d] = curVal.split("-").map(Number);
        currentCalendarDate = new Date(y, m - 1, d || 1);
      }
      renderCalendar();
      calendarPicker.hidden = false;
      calendarPicker.removeAttribute("hidden");
      calendarPicker.style.display = "block";
    } else {
      calendarPicker.hidden = true;
      calendarPicker.setAttribute("hidden", "");
      calendarPicker.style.display = "none";
    }
    reportDateTrigger.setAttribute("aria-expanded", String(shouldOpen));
  };
  reportDateTrigger.addEventListener("click", toggleCalendar);
}

if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    const value = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, "0")}`;
    setReportMonth(value);
    renderCalendar();
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    const value = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, "0")}`;
    setReportMonth(value);
    renderCalendar();
  });
}

if (calendarPicker) {
  calendarPicker.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Navegación diaria, si los controles están disponibles.
const previousDayButton = document.querySelector("#previous-day");
const nextDayButton = document.querySelector("#next-day");
if (previousDayButton) previousDayButton.addEventListener("click", () => moveReportDate(-1));
if (nextDayButton) nextDayButton.addEventListener("click", () => moveReportDate(1));

function moveReportDate(offset) {
  const datePicker = document.querySelector("#report-date-value");
  const currentDateVal = datePicker.value || new Date().toISOString().slice(0, 10);
  const [y, m, d] = currentDateVal.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offset);
  const nextY = date.getFullYear();
  const nextM = String(date.getMonth() + 1).padStart(2, "0");
  const nextD = String(date.getDate()).padStart(2, "0");
  datePicker.value = `${nextY}-${nextM}-${nextD}`;
  currentCalendarDate = new Date(nextY, date.getMonth(), Number(nextD));
  setReportMonth(`${nextY}-${nextM}`);
  renderReport();
}
document.querySelector("#member-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#modal-name").value.trim();
  if (!name) {
    showToast("Escribe el nombre del integrante.");
    document.querySelector("#modal-name").focus();
    return;
  }
  if (modalMode === "add") {
    members.push({ name, status: null, justification: null, note: "" });
    Object.values(dailyRecords).forEach((records) => records.push({ status: null, justification: null }));
    Object.values(monthlyRecords).forEach((records) => records.push({ status: null, justification: null }));
    persistData();
    renderMembers();
    renderDirectory();
    showToast("Integrante agregado y guardado correctamente.");
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
  persistData();
  markChanged();
  closeMemberModal();
});
function applyJustification(button) {
  const selectedStatus = pendingStatus;
  const selectedMemberIndex = justificationMemberIndex;
  const records = getAttendanceRecords();
  if (selectedMemberIndex >= 0 && records[selectedMemberIndex]) {
    records[selectedMemberIndex].status = selectedStatus;
    records[selectedMemberIndex].justification = button.dataset.justification;
    markChanged();
    renderMembers();
    showToast(`${labels[selectedStatus]} marcada como ${button.textContent.toLowerCase()}.`);
  }
  closeJustificationModal();
}

document.querySelectorAll("[data-justification]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    applyJustification(button);
  });
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeAllModals();
    }
  });
});

document.querySelectorAll(".modal-close, .modal-cancel").forEach((closeButton) => {
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeAllModals();
  });
});

document.addEventListener("click", (event) => {
  const closeBtn = event.target.closest(".modal-close, .modal-cancel");
  if (closeBtn) closeAllModals();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeAllModals();
  }
});

function closeAllModals() {
  resumeQrScannerAfterAttendance = false;
  closeMemberModal();
  closeJustificationModal();
  closeQrModal();
  closeQrAttendanceModal();
  closeQrScanner();
  const calendarPicker = document.querySelector("#calendar-picker");
  if (calendarPicker) {
    calendarPicker.hidden = true;
    calendarPicker.setAttribute("hidden", "");
    calendarPicker.style.display = "none";
  }
  const reportDateTrigger = document.querySelector("#report-date-trigger");
  if (reportDateTrigger) reportDateTrigger.setAttribute("aria-expanded", "false");
  const attendanceCalendarPicker = document.querySelector("#attendance-calendar-picker");
  if (attendanceCalendarPicker) {
    attendanceCalendarPicker.hidden = true;
    attendanceCalendarPicker.setAttribute("hidden", "");
    attendanceCalendarPicker.style.display = "none";
  }
  const attendanceCalendarTrigger = document.querySelector("#attendance-calendar-trigger");
  if (attendanceCalendarTrigger) attendanceCalendarTrigger.setAttribute("aria-expanded", "false");
}
document.querySelector("#attendance-date").addEventListener("change", (event) => {
  const dateValue = event.target.value;
  const eventName = getSelectedEvent();
  const recordKey = getEventRecordKey(dateValue, eventName);
  if (!dailyRecords[recordKey]) {
    dailyRecords[recordKey] = createEmptyRecords();
    persistData();
  }
  const date = new Date(`${dateValue}T12:00:00`);
  document.querySelector("#current-date").textContent = date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "").toUpperCase();
  document.querySelector("#report-date-value").value = dateValue;
  setReportMonth(dateValue.slice(0, 7));
  const attendanceTrigger = document.querySelector("#attendance-calendar-trigger");
  if (attendanceTrigger) attendanceTrigger.textContent = date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "").toUpperCase();
  renderMembers();
  renderReport();
  markChanged();
});
window.addEventListener("beforeunload", (event) => { if (hasUnsavedChanges) event.preventDefault(); });
restoreData();
const today = new Date();
const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
setReportMonth(todayValue.slice(0, 7));
document.querySelector("#report-date-value").value = todayValue;
document.querySelector("#attendance-date").value = todayValue;
document.querySelector("#attendance-calendar-trigger").textContent = today.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "").toUpperCase();
document.querySelector("#attendance-date").dispatchEvent(new Event("change"));
document.querySelector("#report-date-value").value = todayValue;
hasUnsavedChanges = false;
document.querySelector("#save-message").textContent = "Registro del día listo";
renderMembers();

const attendanceCalendarTrigger = document.querySelector("#attendance-calendar-trigger");
const attendanceCalendarPicker = document.querySelector("#attendance-calendar-picker");
const attendanceCalendarGrid = document.querySelector("#attendance-calendar-grid");
const attendanceCalendarLabel = document.querySelector("#attendance-calendar-label");
function toggleAttendanceCalendar(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (!attendanceCalendarPicker) return;
  const open = attendanceCalendarPicker.hidden;
  if (open) {
    renderAttendanceCalendar();
    attendanceCalendarPicker.hidden = false;
    attendanceCalendarPicker.removeAttribute("hidden");
    attendanceCalendarPicker.style.display = "block";
  } else {
    attendanceCalendarPicker.hidden = true;
    attendanceCalendarPicker.style.display = "none";
  }
  attendanceCalendarTrigger.setAttribute("aria-expanded", String(open));
}
function renderAttendanceCalendar() {
  if (!attendanceCalendarGrid || !attendanceCalendarLabel) return;
  const input = document.querySelector("#attendance-date");
  const value = input.value || new Date().toISOString().slice(0, 10);
  const date = new Date(`${value}T12:00:00`);
  const year = date.getFullYear();
  const month = date.getMonth();
  attendanceCalendarLabel.textContent = date.toLocaleDateString("es-PE", { month: "long", year: "numeric" }).toUpperCase();
  attendanceCalendarGrid.innerHTML = ["L", "M", "M", "J", "V", "S", "D"].map((day) => `<div class="calendar-day-header">${day}</div>`).join("");
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  for (let i = 0; i < offset; i += 1) attendanceCalendarGrid.insertAdjacentHTML("beforeend", "<div></div>");
  for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day += 1) {
    const dateValue = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `calendar-day-btn${dateValue === value ? " selected" : ""}`;
    button.textContent = day;
    button.addEventListener("click", () => {
      input.value = dateValue;
      input.dispatchEvent(new Event("change"));
      attendanceCalendarTrigger.textContent = new Date(`${dateValue}T12:00:00`).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "").toUpperCase();
      document.querySelector("#report-date-value").value = dateValue;
      attendanceCalendarPicker.hidden = true;
      attendanceCalendarPicker.style.display = "none";
    });
    attendanceCalendarGrid.appendChild(button);
  }
}
if (attendanceCalendarTrigger && attendanceCalendarPicker) {
  attendanceCalendarTrigger.addEventListener("click", window.toggleAttendanceCalendar);
  document.querySelector("#attendance-prev-month").addEventListener("click", () => {
    const input = document.querySelector("#attendance-date");
    const date = new Date(`${input.value}T12:00:00`);
    date.setMonth(date.getMonth() - 1, 1);
    input.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
    renderAttendanceCalendar();
  });
  document.querySelector("#attendance-next-month").addEventListener("click", () => {
    const input = document.querySelector("#attendance-date");
    const date = new Date(`${input.value}T12:00:00`);
    date.setMonth(date.getMonth() + 1, 1);
    input.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
    renderAttendanceCalendar();
  });
}

// No automatic scan

