/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 * 
 * This code handles the interactive behavior of the website switcher for visitors.
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

		// Toggle dropdown on button click
		toggle.addEventListener('click', function(e) {
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
	});
});