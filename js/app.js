    // 1. Initialize Icons
    lucide.createIcons();
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Mobile Menu Toggle ---
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // --- Tool Switching Logic ---
    function switchTool(toolName) {
        if(toolName === 'fingerprint') runFingerprint();

        // Hide all views
        document.querySelectorAll('.tool-view').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('fade-in');
        });
        
        // Reset all Tabs
        document.querySelectorAll('.tool-tab').forEach(el => {
            el.classList.remove('border-[var(--color-secondary)]');
            el.classList.add('border-transparent');
            
            const icon = el.querySelector('svg') || el.querySelector('i');
            if (icon) {
                icon.classList.remove('text-[var(--color-secondary)]');
                icon.classList.add('text-gray-500');
            }
        });

        // Show Selected View
        const selectedView = document.getElementById(`view-${toolName}`);
        if (selectedView) {
            selectedView.classList.remove('hidden');
            selectedView.classList.add('fade-in');
        }

        // Highlight Selected Tab
        const selectedTab = document.getElementById(`tab-${toolName}`);
        if (selectedTab) {
            selectedTab.classList.remove('border-transparent');
            selectedTab.classList.add('border-[var(--color-secondary)]');
            
            const activeIcon = selectedTab.querySelector('svg') || selectedTab.querySelector('i');
            if (activeIcon) {
                activeIcon.classList.remove('text-gray-500');
                activeIcon.classList.add('text-[var(--color-secondary)]');
            }
        }
    }

    // --- Tool 1: Scanner Simulation ---
    function runScanner() {
        const input = document.getElementById('target-ip').value;
        const output = document.getElementById('scanner-output');
        const blinker = '<span class="cursor-blink">_</span>';
        
        if(!input) {
            output.innerHTML = output.innerHTML.replace(blinker, '');
            output.innerHTML += `<div class="text-red-400 mb-1">user@ciphershield:~$ Error: Target IP/Domain required.</div>`;
            output.innerHTML += `<span>user@ciphershield:~$ ${blinker}</span>`;
            output.scrollTop = output.scrollHeight;
            return;
        }

        output.innerHTML = output.innerHTML.replace(blinker, '');
        output.innerHTML += `<div class="mb-1">user@ciphershield:~$ ./netnode_scan -v ${input}</div>`;
        
        const steps = [
            `[INIT] Resolving host ${input}...`,
            `[NET] Pinging target... [Host Alive: 14ms]`,
            `[SCAN] Starting TCP Connect Scan on 1000 ports...`,
            `[PORT] Discovered Open Port: 80/tcp (HTTP)`,
            `[PORT] Discovered Open Port: 443/tcp (HTTPS)`,
            `[WARN] Port 21/tcp (FTP) is open. Plaintext protocol detected.`,
            `[VULN] CVE-2023-XXXX check... <span class='text-green-500'>[SAFE]</span>`,
            `[DONE] Scan finished. 1 Potential configuration issue found.`
        ];

        let i = 0;
        const interval = setInterval(() => {
            if(i < steps.length) {
                output.innerHTML += `<div class="text-gray-300">${steps[i]}</div>`;
                output.scrollTop = output.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
                output.innerHTML += `<div class="mt-2 text-[var(--color-secondary)]">user@ciphershield:~$ ${blinker}</div>`;
                output.scrollTop = output.scrollHeight;
            }
        }, 500);
    }

    // --- Tool 2: AES Data Vault Logic (Active) ---
    function encryptData() {
        const data = document.getElementById('vault-input').value;
        const key = document.getElementById('vault-key').value;
        
        if(!data || !key) { 
            document.getElementById('vault-result').innerHTML = "<span class='text-red-500'>Error: Please enter both text and a secret key.</span>";
            return; 
        }
        
        try {
            // Using CryptoJS from the library added in header
            const encrypted = CryptoJS.AES.encrypt(data, key).toString();
            document.getElementById('vault-result').innerText = encrypted;
            document.getElementById('vault-result').classList.add("text-red-600");
            document.getElementById('vault-result').classList.remove("text-green-600");
        } catch(e) {
            document.getElementById('vault-result').innerText = "Encryption Failed.";
        }
    }

    function decryptData() {
        const data = document.getElementById('vault-input').value;
        const key = document.getElementById('vault-key').value;
        
        if(!data || !key) { 
            document.getElementById('vault-result').innerHTML = "<span class='text-red-500'>Error: Please enter the encrypted string and the secret key.</span>";
            return; 
        }
        
        try {
            const bytes  = CryptoJS.AES.decrypt(data, key);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            
            if(originalText) {
                document.getElementById('vault-result').innerText = originalText;
                document.getElementById('vault-result').classList.remove("text-red-600");
                document.getElementById('vault-result').classList.add("text-green-600");
            } else {
                document.getElementById('vault-result').innerHTML = "<span class='text-red-500'>Decryption Failed: Wrong Key or Corrupted Data.</span>";
            }
        } catch(e) {
            document.getElementById('vault-result').innerHTML = "<span class='text-red-500'>Error: Invalid encrypted format.</span>";
        }
    }

    // --- Tool 3: Crypto Lab Logic ---
    function runCrypto() {
        const input = document.getElementById('crypto-input').value;
        
        if(!input) {
            document.getElementById('out-base64').innerText = "...";
            document.getElementById('out-hex').innerText = "...";
            document.getElementById('out-binary').innerText = "...";
            return;
        }

        try { document.getElementById('out-base64').innerText = btoa(input); } 
        catch(e) { document.getElementById('out-base64').innerText = "Input error"; }

        let hex = '';
        for(let i=0;i<input.length;i++) hex += '' + input.charCodeAt(i).toString(16);
        document.getElementById('out-hex').innerText = hex;

        let bin = '';
        for (let i = 0; i < input.length; i++) bin += input[i].charCodeAt(0).toString(2).padStart(8, '0') + ' ';
        document.getElementById('out-binary').innerText = bin;
    }

    // --- Tool 4: Fingerprint Logic ---
    function runFingerprint() {
        document.getElementById('fp-ua').textContent = navigator.userAgent;
        document.getElementById('fp-os').textContent = navigator.platform; 
        document.getElementById('fp-res').textContent = window.screen.width + "x" + window.screen.height;
        document.getElementById('fp-lang').textContent = navigator.language.toUpperCase();
        document.getElementById('fp-cores').textContent = navigator.hardwareConcurrency || "Unknown";
    }

    // --- Tool 5: Quiz Logic ---
    const questions = [
        { q: "You receive an email from 'supp0rt@g0ogle.com' asking for your password. What type of attack is this?", a: ["Phishing", "DDoS", "SQL Injection"], correct: 0 },
        { q: "Which of these is the most secure password?", a: ["Password123!", "Admin@2024", "Kj9#m$2Lp!x"], correct: 2 },
        { q: "What does 'HTTPS' imply about a website?", a: ["It is 100% unhackable", "Traffic is encrypted (Ciphertext)", "The site is owned by Google"], correct: 1 }
    ];
    
    let currentQ = 0;
    let quizScore = 0;

    function answerQuiz(choiceIndex) {
        if(choiceIndex === questions[currentQ].correct) quizScore++;
        currentQ++;
        if(currentQ < questions.length) renderQuestion();
        else showResults();
    }

    function renderQuestion() {
        const qObj = questions[currentQ];
        const area = document.getElementById('quiz-question-area');
        area.innerHTML = `
            <h4 class="text-lg font-semibold mb-4">Question ${currentQ+1}: ${qObj.q}</h4>
            <div class="space-y-3">
                ${qObj.a.map((ans, idx) => `
                    <button onclick="answerQuiz(${idx})" class="w-full text-left p-3 border rounded hover:bg-sky-50 hover:border-[var(--color-secondary)] transition font-medium text-gray-700">${ans}</button>
                `).join('')}
            </div>
        `;
    }

    function showResults() {
        document.getElementById('quiz-question-area').classList.add('hidden');
        document.getElementById('quiz-result-area').classList.remove('hidden');
        document.getElementById('quiz-score').innerText = `${quizScore} / ${questions.length}`;
    }

    function resetQuiz() {
        currentQ = 0;
        quizScore = 0;
        document.getElementById('quiz-result-area').classList.add('hidden');
        document.getElementById('quiz-question-area').classList.remove('hidden');
        renderQuestion();
    }
    
    // Initial render
    renderQuestion();