// Function to load external HTML components
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with id "${elementId}" not found`);
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Function to initialize sidebar functionality
function initSidebar() {
    // HEADER NAV IN MOBILE
    if (document.querySelector(".ul-header-nav")) {
        const ulSidebar = document.querySelector(".ul-sidebar");
        const ulSidebarOpener = document.querySelector(".ul-header-sidebar-opener");
        const ulSidebarCloser = document.querySelector(".ul-sidebar-closer");
        const ulMobileMenuContent = document.querySelector(".to-go-to-sidebar-in-mobile");
        const ulHeaderNavMobileWrapper = document.querySelector(".ul-sidebar-header-nav-wrapper");
        const ulHeaderNavOgWrapper = document.querySelector(".ul-header-nav-wrapper");

        function updateMenuPosition() {
            if (window.innerWidth < 992) {
                ulHeaderNavMobileWrapper.appendChild(ulMobileMenuContent);
            }

            if (window.innerWidth >= 992) {
                ulHeaderNavOgWrapper.appendChild(ulMobileMenuContent);
            }
        }

        updateMenuPosition();

        window.addEventListener("resize", () => {
            updateMenuPosition();
        });

        if (ulSidebarOpener) {
            ulSidebarOpener.addEventListener("click", () => {
                ulSidebar.classList.add("active");
            });
        }

        if (ulSidebarCloser) {
            ulSidebarCloser.addEventListener("click", () => {
                ulSidebar.classList.remove("active");
            });
        }

        // menu dropdown/submenu in mobile
        const ulHeaderNavMobile = document.querySelector(".ul-header-nav");
        if (ulHeaderNavMobile) {
            const ulHeaderNavMobileItems = ulHeaderNavMobile.querySelectorAll(".has-sub-menu");
            ulHeaderNavMobileItems.forEach((item) => {
                if (window.innerWidth < 992) {
                    item.addEventListener("click", (e) => {
                        e.preventDefault();
                        item.classList.toggle("active");
                    });
                }
            });
        }
    }
}

// Function to initialize components after loading
function initializeComponents() {
    // Initialize sidebar functionality
    initSidebar();
    
    // Dispatch a custom event to indicate components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
}

// Initialize sticky header
function initStickyHeader() {
    const header = document.querySelector('.ul-header');
    if (!header) return;

    const stickyClass = 'sticky';
    const scrollThreshold = 100;

    function handleScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollY > scrollThreshold) {
            header.classList.add(stickyClass);
        } else {
            header.classList.remove(stickyClass);
        }
    }

    // Initial check
    handleScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
}

// Load navbar and footer when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Create containers for navbar and footer if they don't exist
    if (!document.getElementById('navbar-container')) {
        const navbarContainer = document.createElement('div');
        navbarContainer.id = 'navbar-container';
        document.body.insertBefore(navbarContainer, document.body.firstChild);
    }
    
    if (!document.getElementById('footer-container')) {
        const footerContainer = document.createElement('div');
        footerContainer.id = 'footer-container';
        document.body.appendChild(footerContainer);
    }
    
    // Load components
    await Promise.all([
        loadComponent('navbar-container', 'components/navbar.html'),
        loadComponent('footer-container', 'components/footer.html')
    ]);
    
    // Initialize components
    initializeComponents();
    
    // Initialize sticky header after components are loaded
    setTimeout(initStickyHeader, 100);
});

// Alternative method using XMLHttpRequest for older browser support
function loadComponentXHR(elementId, filePath) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = xhr.responseText;
                }
            } else {
                console.error(`Failed to load ${filePath}: ${xhr.status}`);
            }
        }
    };
    xhr.open('GET', filePath, true);
    xhr.send();
}
