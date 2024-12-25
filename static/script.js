document.addEventListener("DOMContentLoaded", function () {
    const analyzeLogsButton = document.getElementById("analyzeLogs");
    const logInput = document.getElementById("logInput");
    const resultSection = document.getElementById("resultSection");
    const resultsDiv = document.getElementById("results");

    // Validasi apakah elemen ditemukan
    if (!analyzeLogsButton || !logInput || !resultSection || !resultsDiv) {
        console.error("Error: One or more elements not found in the DOM.");
        return;
    }

    // Tambahkan event listener ke tombol Analyze Logs
    analyzeLogsButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Cegah form submit default

        const logs = logInput.value.trim(); // Ambil nilai dari textarea

        if (!logs) {
            alert("Please enter security logs to analyze."); // Tampilkan pesan jika textarea kosong
            return;
        }

        // Simulasikan format JSON yang sesuai untuk backend
        const requestData = [{ log: logs }];

        try {
            // Kirim permintaan POST ke server
            const response = await fetch("http://localhost:8080/detect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData), // Kirim log dalam format JSON
            });

            // Validasi respons server
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analysisResults = await response.json();

            // Validasi apakah respons adalah array
            if (!Array.isArray(analysisResults)) {
                throw new Error("Unexpected response format: Expected an array.");
            }

            // Tampilkan hasil analisis
            resultSection.style.display = "block";
            resultsDiv.innerHTML = ""; // Bersihkan hasil sebelumnya

            analysisResults.forEach((result, index) => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");
                resultItem.innerHTML = `
                    <h3>Result ${index + 1}</h3>
                    <p><strong>Risk Level:</strong> ${result.risk.level}</p>
                    <p><strong>Total Score:</strong> ${result.risk.total_score}</p>
                    <p><strong>Action:</strong> ${result.action}</p>
                    <p><strong>Anomaly:</strong> ${JSON.stringify(result.anomaly)}</p>
                `;
                resultsDiv.appendChild(resultItem);
            });
        } catch (error) {
            console.error("Error analyzing logs:", error);
            alert("An error occurred while analyzing logs. Please check the console.");
        }
    });
});
