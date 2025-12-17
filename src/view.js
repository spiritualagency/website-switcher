/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 * 
 * This code handles the interactive behavior of the draggable website switcher for visitors.
 */

document.addEventListener('DOMContentLoaded', function() {
	const switchers = document.querySelectorAll('.website-switcher');

	switchers.forEach(function(switcher) {
		const toggle = switcher.querySelector('.website-switcher__toggle');
		const dropdown = switcher.querySelector('.website-switcher__dropdown');

		if (!toggle || !dropdown) {
			return;
		}

		let isOpen = false;
		let isDragging = false;
		let dragStartX = 0;
		let dragStartY = 0;
		let switcherStartX = 0;
		let switcherStartY = 0;

		// Create drag handle
		const dragHandle = document.createElement('div');
		dragHandle.className = 'website-switcher__drag-handle';
		switcher.insertBefore(dragHandle, switcher.firstChild);

		// Load saved position from localStorage
		const savedPosition = localStorage.getItem('websiteSwitcherPosition');
		if (savedPosition) {
			try {
				const position = JSON.parse(savedPosition);
				if (window.innerWidth >= 768) {
					if (position.desktop) {
						switcher.style.left = position.desktop.left;
						switcher.style.top = position.desktop.top;
						switcher.style.right = 'auto';
						switcher.style.bottom = 'auto';
						switcher.style.transform = 'none';
					}
				} else {
					if (position.mobile) {
						switcher.style.left = position.mobile.left;
						switcher.style.top = position.mobile.top;
						switcher.style.right = 'auto';
						switcher.style.bottom = 'auto';
						switcher.style.transform = 'none';
					}
				}
			} catch (e) {
				// Invalid saved position, ignore
			}
		}

		// Toggle dropdown on button click
		toggle.addEventListener('click', function(e) {
			if (isDragging) {
				return;
			}
			e.stopPropagation();
			isOpen = !isOpen;

			if (isOpen) {
				openDropdown();
			} else {
				closeDropdown();
			}
		});

		function openDropdown() {
			dropdown.hidden = false;
			dropdown.classList.add('is-animating-in');
			toggle.setAttribute('aria-expanded', 'true');
			
			setTimeout(function() {
				dropdown.classList.remove('is-animating-in');
			}, 200);

			// Focus first link for accessibility
			const firstLink = dropdown.querySelector('.website-switcher__link');
			if (firstLink) {
				setTimeout(function() {
					firstLink.focus();
				}, 100);
			}
		}

		function closeDropdown() {
			dropdown.classList.add('is-animating-out');
			toggle.setAttribute('aria-expanded', 'false');
			
			setTimeout(function() {
				dropdown.hidden = true;
				dropdown.classList.remove('is-animating-out');
			}, 200);
			
			isOpen = false;
		}

		// Dragging functionality
		function startDrag(e) {
			if (e.target.closest('.website-switcher__dropdown') || 
				e.target.closest('.website-switcher__toggle')) {
				// Don't start drag if clicking on dropdown or button itself
				if (!e.target.closest('.website-switcher__drag-handle')) {
					return;
				}
			}

			e.preventDefault();
			isDragging = true;
			switcher.classList.add('is-dragging');

			const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
			const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

			dragStartX = clientX;
			dragStartY = clientY;

			const rect = switcher.getBoundingClientRect();
			switcherStartX = rect.left;
			switcherStartY = rect.top;

			// Close dropdown when starting to drag
			if (isOpen) {
				closeDropdown();
			}
		}

		function drag(e) {
			if (!isDragging) return;

			e.preventDefault();

			const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
			const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

			const deltaX = clientX - dragStartX;
			const deltaY = clientY - dragStartY;

			let newX = switcherStartX + deltaX;
			let newY = switcherStartY + deltaY;

			// Constrain to viewport
			const rect = switcher.getBoundingClientRect();
			const maxX = window.innerWidth - rect.width;
			const maxY = window.innerHeight - rect.height;

			newX = Math.max(0, Math.min(newX, maxX));
			newY = Math.max(0, Math.min(newY, maxY));

			switcher.style.left = newX + 'px';
			switcher.style.top = newY + 'px';
			switcher.style.right = 'auto';
			switcher.style.bottom = 'auto';
			switcher.style.transform = 'none';
		}

		function endDrag() {
			if (!isDragging) return;

			isDragging = false;
			switcher.classList.remove('is-dragging');

			// Save position to localStorage
			const rect = switcher.getBoundingClientRect();
			const savedPosition = JSON.parse(localStorage.getItem('websiteSwitcherPosition') || '{}');
			
			if (window.innerWidth >= 768) {
				savedPosition.desktop = {
					left: rect.left + 'px',
					top: rect.top + 'px'
				};
			} else {
				savedPosition.mobile = {
					left: rect.left + 'px',
					top: rect.top + 'px'
				};
			}

			localStorage.setItem('websiteSwitcherPosition', JSON.stringify(savedPosition));
		}

		// Mouse events
		switcher.addEventListener('mousedown', startDrag);
		document.addEventListener('mousemove', drag);
		document.addEventListener('mouseup', endDrag);

		// Touch events
		switcher.addEventListener('touchstart', startDrag, { passive: false });
		document.addEventListener('touchmove', drag, { passive: false });
		document.addEventListener('touchend', endDrag);

		// Close dropdown when clicking outside
		document.addEventListener('click', function(e) {
			if (isOpen && !switcher.contains(e.target)) {
				closeDropdown();
			}
		});

		// Close dropdown on Escape key
		document.addEventListener('keydown', function(e) {
			if (isOpen && e.key === 'Escape') {
				closeDropdown();
				toggle.focus();
			}
		});

		// Handle keyboard navigation within dropdown
		dropdown.addEventListener('keydown', function(e) {
			if (!isOpen) return;

			const links = Array.from(dropdown.querySelectorAll('.website-switcher__link'));
			const currentIndex = links.indexOf(document.activeElement);

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				const nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
				links[nextIndex].focus();
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
				links[prevIndex].focus();
			} else if (e.key === 'Home') {
				e.preventDefault();
				links[0].focus();
			} else if (e.key === 'End') {
				e.preventDefault();
				links[links.length - 1].focus();
			}
		});

		// Handle window resize - reposition if needed
		window.addEventListener('resize', function() {
			const rect = switcher.getBoundingClientRect();
			if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
				const newX = Math.min(rect.left, window.innerWidth - rect.width);
				const newY = Math.min(rect.top, window.innerHeight - rect.height);
				switcher.style.left = Math.max(0, newX) + 'px';
				switcher.style.top = Math.max(0, newY) + 'px';
			}
		});
	});
});