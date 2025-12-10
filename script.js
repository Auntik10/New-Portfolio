/* === script.js content === */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in the footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Theme Toggle (Dark Mode)
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
    
    // 3. Skill Bar Animation
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar span');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
                observer.unobserve(skillsSection); 
            }
        });
    }, { threshold: 0.5 }); 
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // 4. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const mailtoBtn = document.getElementById('mailtoBtn');
    const contactResponse = document.getElementById('contactResponse');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!contactForm.checkValidity()) {
            contactResponse.textContent = 'Please fill out all required fields.';
            contactResponse.style.color = 'red';
            return;
        }

        contactResponse.textContent = 'Thank you! Your message has been noted.';
        contactResponse.style.color = 'var(--accent)';
        contactForm.reset();
        
        setTimeout(() => {
            contactResponse.textContent = '';
        }, 5000);
    });

    mailtoBtn.addEventListener('click', () => {
        const email = 'sarker2205101598@diu.edu.bd';
        const subject = 'Inquiry from your Portfolio';
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    });

    // 5. Resume Download Functionality (The definitive fixed version)
    document.getElementById('downloadResumeBtn').addEventListener('click', () => {
        
        // Safety check
        if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
            alert('Error: Resume generation libraries are not loaded correctly.');
            return;
        }
        
        // Elements to hide for PDF
        const elementsToHide = [
            document.querySelector('.nav'), 
            document.querySelector('.site-footer'),
            document.querySelector('.hero-ctas'),
            document.querySelector('.project-filters'),
            document.getElementById('contact')
        ];
        
        elementsToHide.forEach(el => el ? el.style.display = 'none' : null);

        // Capture and Convert the HTML to PDF
        html2canvas(document.body, {
            scale: 2, 
            useCORS: true,
            windowWidth: 1200,
            allowTaint: true,
            logging: true
        }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const ratio = canvas.width / pdfWidth;
            const imgHeight = canvas.height / ratio;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= -5) { 
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('Auntik_Krishna_Sarker_Resume.pdf');
        })
        .catch(error => {
            console.error('Error generating PDF:', error);
            alert('Failed to generate resume. Check the console (F12) for detailed error messages.'); 
        })
        .finally(() => {
            // RESTORE ELEMENTS: Runs regardless of success or failure.
            elementsToHide.forEach(el => el ? el.style.display = '' : null);
        });
    });
});