const threatTableBody = document.querySelector('#threatTable tbody');
const totalThreats = document.getElementById('totalThreats');
const highRiskThreats = document.getElementById('highRiskThreats');
const mediumRiskThreats = document.getElementById('mediumRiskThreats');
const lowRiskThreats = document.getElementById('lowRiskThreats');
const mostSevereThreat = document.getElementById('mostSevereThreat');

function updateStatistics() {
    const rows = document.querySelectorAll('#threatTable tbody tr');
    let total = 0, high = 0, medium = 0, low = 0;
    let maxScore = -1;
    let severeThreat = "N/A";

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const score = parseInt(cells[2].textContent);
        const name = cells[0].textContent;

        total++;

        if (score >= 0 && score <= 3) low++;
        else if (score >= 4 && score <= 6) medium++;
        else if (score >= 7) high++;

        if (score > maxScore) {
            maxScore = score;
            severeThreat = name;
        }
    });

    totalThreats.textContent = total;
    highRiskThreats.textContent = high;
    mediumRiskThreats.textContent = medium;
    lowRiskThreats.textContent = low;
    mostSevereThreat.textContent = severeThreat;
}

function getRiskLevel(score) {
    if (score >= 0 && score <= 3) return "Low Risk";
    if (score >= 4 && score <= 6) return "Medium Risk";
    if (score >= 7 && score <= 10) return "High Risk";
    return "Unknown";
}

function getMitigation(category) {
    switch (category) {
        case "Spoofing":
            return "Implement multi-factor authentication (MFA).";
        case "Tampering":
            return "Add data hashing or encryption.";
        case "Repudiation":
            return "Use audit trails to track actions.";
        case "Information Disclosure":
            return "Strengthen data access policies.";
        case "Denial of Service":
            return "Implement rate-limiting and monitoring.";
        case "Elevation of Privilege":
            return "Restrict permissions and validate inputs.";
        default:
            return "No recommendation available.";
    }
}

function addThreat() {
    const threatName = document.getElementById('threatName').value;
    const strideCategory = document.getElementById('strideCategory').value;
    const dreadScore = parseInt(document.getElementById('dreadScore').value);

    if (!threatName || dreadScore === "" || dreadScore < 0 || dreadScore > 10) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const riskLevel = getRiskLevel(dreadScore);
    const mitigation = getMitigation(strideCategory);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${threatName}</td>
        <td>${strideCategory}</td>
        <td>${dreadScore}</td>
        <td>${riskLevel}</td>
        <td>${mitigation}</td>
        <td class="action-buttons">
            <button class="edit-button" onclick="openEditPopup(this)">Edit</button>
            <button class="duplicate-button" onclick="duplicateThreat(this)">Duplicate</button>
            <button class="delete-button" onclick="deleteThreat(this)">Delete</button>
        </td>
    `;

    threatTableBody.appendChild(row);

    document.getElementById('threatName').value = "";
    document.getElementById('strideCategory').value = "Spoofing";
    document.getElementById('dreadScore').value = "";

    updateStatistics();
}

function filterByRiskLevel() {
    const selectedRiskLevel = document.getElementById('riskLevelDropdown').value;
    const rows = document.querySelectorAll('#threatTable tbody tr');

    rows.forEach(row => {
        const riskLevel = row.cells[3].textContent;

        if (selectedRiskLevel === "" || riskLevel === selectedRiskLevel) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function duplicateThreat(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    const threatName = cells[0].textContent;
    const strideCategory = cells[1].textContent;
    const dreadScore = cells[2].textContent;
    const riskLevel = cells[3].textContent;
    const mitigation = cells[4].textContent;

    const duplicateRow = document.createElement('tr');
    duplicateRow.innerHTML = `
        <td>${threatName}</td>
        <td>${strideCategory}</td>
        <td>${dreadScore}</td>
        <td>${riskLevel}</td>
        <td>${mitigation}</td>
        <td class="action-buttons">
            <button class="edit-button" onclick="openEditPopup(this)">Edit</button>
            <button class="duplicate-button" onclick="duplicateThreat(this)">Duplicate</button>
            <button class="delete-button" onclick="deleteThreat(this)">Delete</button>
        </td>
    `;

    threatTableBody.appendChild(duplicateRow);
    updateStatistics();
}

function deleteThreat(button) {
    const row = button.closest('tr');
    row.remove();
    updateStatistics();
}

function filterThreats() {
    const selectedCategory = document.getElementById('searchDropdown').value;
    const rows = document.querySelectorAll('#threatTable tbody tr');

    rows.forEach(row => {
        const strideCategory = row.cells[1].textContent;

        if (selectedCategory === "" || strideCategory === selectedCategory) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Threat Name,STRIDE Category,DREAD Score,Risk Level,Mitigation Recommendation\n";

    const rows = document.querySelectorAll('#threatTable tbody tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        const rowData = Array.from(cols).slice(0, 5).map(col => col.textContent).join(',');
        csvContent += rowData + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'threat_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Tambahkan judul
    doc.setFontSize(16);
    doc.text("Threat and Risk Scoring Report", 14, 20);

    // Ambil data dari tabel
    const table = document.getElementById('threatTable');
    const rows = table.querySelectorAll('tbody tr');
    
    if (rows.length === 0) {
        alert("No data available to export.");
        return;
    }

    // Ambil data dari tabel untuk autoTable
    const tableData = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).slice(0, 5).map(cell => cell.textContent);
        tableData.push(rowData);
    });

    // Header tabel
    const tableHeaders = ['Threat Name', 'STRIDE Category', 'DREAD Score', 'Risk Level', 'Mitigation Recommendation'];

    // Tambahkan tabel ke PDF
    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 30,
        theme: 'grid', // Pilihan tema (striped, grid, plain)
        headStyles: { fillColor: [0, 102, 204] }, // Warna header
        styles: { fontSize: 10, cellPadding: 5 }, // Ukuran font dan padding sel
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Warna baris alternatif
    });

    // Tambahkan footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }

    // Simpan PDF
    doc.save('threat_risk_report.pdf');
}

function openEditPopup(button) {
    // Dapatkan baris data dari tombol edit
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    // Ambil data dari sel baris
    const threatName = cells[0].textContent;
    const strideCategory = cells[1].textContent;
    const dreadScore = cells[2].textContent;

    // Tampilkan popup untuk mengedit data
    Swal.fire({
        title: 'Edit Threat Details',
        html: `
            <div style="text-align: left; padding: 10px;">
                <div style="margin-bottom: 15px;">
                    <label for="editThreatName" style="font-weight: bold; margin-bottom: 5px; display: block;">Threat Name:</label>
                    <input id="editThreatName" class="swal2-input" style="width: 100%; box-sizing: border-box;" value="${threatName}">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="editStrideCategory" style="font-weight: bold; margin-bottom: 5px; display: block;">STRIDE Category:</label>
                    <select id="editStrideCategory" class="swal2-input" style="width: 100%; box-sizing: border-box;">
                        <option value="Spoofing" ${strideCategory === "Spoofing" ? "selected" : ""}>Spoofing</option>
                        <option value="Tampering" ${strideCategory === "Tampering" ? "selected" : ""}>Tampering</option>
                        <option value="Repudiation" ${strideCategory === "Repudiation" ? "selected" : ""}>Repudiation</option>
                        <option value="Information Disclosure" ${strideCategory === "Information Disclosure" ? "selected" : ""}>Information Disclosure</option>
                        <option value="Denial of Service" ${strideCategory === "Denial of Service" ? "selected" : ""}>Denial of Service</option>
                        <option value="Elevation of Privilege" ${strideCategory === "Elevation of Privilege" ? "selected" : ""}>Elevation of Privilege</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="editDreadScore" style="font-weight: bold; margin-bottom: 5px; display: block;">DREAD Score:</label>
                    <input id="editDreadScore" class="swal2-input" type="number" min="0" max="10" style="width: 100%; box-sizing: border-box;" value="${dreadScore}">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        focusConfirm: false,
        preConfirm: () => {
            const newThreatName = document.getElementById('editThreatName').value.trim();
            const newStrideCategory = document.getElementById('editStrideCategory').value;
            const newDreadScore = document.getElementById('editDreadScore').value.trim();

            if (!newThreatName || newDreadScore === "" || isNaN(newDreadScore) || newDreadScore < 0 || newDreadScore > 10) {
                Swal.showValidationMessage('Please fill in all fields correctly.');
                return false;
            }

            return {
                threatName: newThreatName,
                strideCategory: newStrideCategory,
                dreadScore: parseInt(newDreadScore)
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Perbarui data di tabel
            const { threatName, strideCategory, dreadScore } = result.value;

            cells[0].textContent = threatName;
            cells[1].textContent = strideCategory;
            cells[2].textContent = dreadScore;
            cells[3].textContent = getRiskLevel(dreadScore); // Perbarui tingkat risiko
            cells[4].textContent = getMitigation(strideCategory); // Perbarui rekomendasi mitigasi

            // Perbarui statistik
            updateStatistics();

            Swal.fire('Success!', 'The threat details have been updated.', 'success');
        }
    });
}

//ai

