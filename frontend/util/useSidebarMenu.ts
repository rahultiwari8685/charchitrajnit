// util/useSidebarMenu.ts
import { useEffect, useCallback } from 'react';

const useSidebarMenu = () => {
  const initSidebarMenu = useCallback(() => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebarLeft = document.querySelector('.sidebar-left');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const closeSidebar = document.querySelector('.close-sidebar');

    // Toggle sidebar function
    const toggleSidebar = (isOpen: boolean) => {
      if (!sidebarLeft || !sidebarOverlay) return;
      
      if (isOpen) {
        sidebarLeft.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        sidebarLeft.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    // Navbar toggler click handler
    if (navbarToggler && sidebarLeft && sidebarOverlay) {
      navbarToggler.addEventListener('click', (e: Event) => {
        e.preventDefault();
        toggleSidebar(true);
      });
    }

    // Overlay click handler
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        toggleSidebar(false);
      });
    }

    // Close button click handler
    if (closeSidebar) {
      closeSidebar.addEventListener('click', (e: Event) => {
        e.preventDefault();
        toggleSidebar(false);
      });
    }

    // Toggle submenu for collapse-toggle items
    document.querySelectorAll('.sidebar-nav .collapse-toggle').forEach((toggle) => {
      toggle.addEventListener('click', function(this: HTMLElement, e: Event) {
        e.preventDefault();
        const parentItem = this.closest('.nav-item');
        const submenu = this.nextElementSibling as HTMLElement;

        if (parentItem) {
          parentItem.classList.toggle('active');
          if (submenu && submenu.classList.contains('collapse-menu')) {
            submenu.style.maxHeight = submenu.style.maxHeight ? '' : `${submenu.scrollHeight}px`;
          }
        }
      });
    });

    // Toggle submenu for has-child items
    document.querySelectorAll('.sidebar-nav .has-child').forEach((childToggle) => {
      childToggle.addEventListener('click', function(this: HTMLElement, e: Event) {
        e.preventDefault();
        const parentItem = this.closest('.nav-item-has-child');
        const submenu = this.nextElementSibling as HTMLElement;

        if (parentItem) {
          parentItem.classList.toggle('active');
          if (submenu && submenu.classList.contains('sub-menu')) {
            submenu.style.maxHeight = submenu.style.maxHeight ? '' : `${submenu.scrollHeight}px`;
          }
        }
      });
    });

    // Close popup handler
    document.querySelectorAll('.close-popup').forEach((closeBtn) => {
      closeBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const sidebar = document.querySelector('.sidebar-left');
        const popup = document.querySelector('.popup-search-overlay');
        
        if (sidebar) sidebar.classList.remove('active');
        if (popup) popup.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Cleanup function
    return () => {
      // Remove all event listeners when component unmounts
      if (navbarToggler) {
        const newToggler = navbarToggler.cloneNode(true);
        if (navbarToggler.parentNode) {
          navbarToggler.parentNode.replaceChild(newToggler, navbarToggler);
        }
      }
      // Other cleanup code...
    };
  }, []);

  useEffect(() => {
    const cleanup = initSidebarMenu();
    return cleanup;
  }, [initSidebarMenu]);

  // Export toggle function if needed
  const toggleSidebar = useCallback((isOpen: boolean) => {
    const sidebarLeft = document.querySelector('.sidebar-left');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (!sidebarLeft || !sidebarOverlay) return;
    
    if (isOpen) {
      sidebarLeft.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      sidebarLeft.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, []);

  return { toggleSidebar };
};

export default useSidebarMenu;