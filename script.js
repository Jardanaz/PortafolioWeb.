document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const languageSelector = document.getElementById('language-selector');
    let currentLang = localStorage.getItem('lang') || 'es';

    // Cargar textos según el idioma
    const loadLanguage = async (lang) => {
        const response = await fetch(`languages/${lang}.json`);
        const texts = await response.json();
        if (currentPage === 'index.html' || currentPage === '') {
            document.getElementById('intro-title').textContent = texts.introTitle;
            document.getElementById('intro-subtitle').textContent = texts.introSubtitle;
            document.getElementById('about-text').textContent = texts.aboutText;
        } else if (currentPage === 'projects.html') {
            document.getElementById('projects-title').textContent = texts.projectsTitle;
        } else if (currentPage === 'contact.html') {
            document.getElementById('contact-title').textContent = texts.contactTitle;
            document.getElementById('contact-description').textContent = texts.contactDescription;
        }
    };

    // Cargar proyectos desde JSON (solo en projects.html)
    if (currentPage === 'projects.html') {
        const projectList = document.getElementById('project-list');
        const filtersContainer = document.getElementById('filters');
        let projects = [];
        let allTechnologies = new Set();

        const loadProjects = async () => {
            const response = await fetch('projects.json');
            projects = await response.json();
            displayProjects(projects);
            generateFilters();
        };

        const displayProjects = (projectsToShow) => {
            projectList.innerHTML = '';
            projectsToShow.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project');
                projectDiv.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p><strong>Tecnologías:</strong> ${project.technologies.join(', ')}</p>
                    <a href="${project.link}" target="_blank">Ver Proyecto</a>
                `;
                projectList.appendChild(projectDiv);
            });
        };

        const generateFilters = () => {
            projects.forEach(project => {
                project.technologies.forEach(tech => allTechnologies.add(tech));
            });
            allTechnologies.forEach(tech => {
                const button = document.createElement('button');
                button.textContent = tech;
                button.dataset.filter = tech;
                filtersContainer.appendChild(button);
            });

            filtersContainer.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const filter = e.target.dataset.filter;
                    const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.technologies.includes(filter));
                    displayProjects(filteredProjects);
                    document.querySelectorAll('#filters button').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        };

        loadProjects();
    }

    // Selector de idioma
    languageSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentLang = e.target.dataset.lang;
            localStorage.setItem('lang', currentLang);
            loadLanguage(currentLang);
        }
    });

    // Cargar idioma al inicio
    loadLanguage(currentLang);
});