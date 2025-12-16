/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block properties
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { websites, switcherIcon, buttonText, desktopPlacement, mobilePlacement, buttonBackgroundColor, buttonTextColor } = attributes;

	const blockProps = useBlockProps.save( {
		className: `placement-desktop-${desktopPlacement} placement-mobile-${mobilePlacement}`,
	} );

	const buttonStyle = {
		backgroundColor: buttonBackgroundColor,
		color: buttonTextColor,
	};

	return (
		<div { ...blockProps }>
			<div className="website-switcher" data-websites={ JSON.stringify( websites ) }>
				<button
					className="website-switcher__toggle"
					type="button"
					aria-label="Toggle website switcher"
					aria-expanded="false"
					aria-haspopup="true"
					style={ buttonStyle }
					data-bg-color={ buttonBackgroundColor }
					data-text-color={ buttonTextColor }
				>
					{ switcherIcon && (
						<img
							src={ switcherIcon }
							alt=""
							className="website-switcher__icon"
						/>
					) }
					<span className="website-switcher__button-text">
						{ buttonText }
					</span>
					<span className="website-switcher__arrow" aria-hidden="true">▼</span>
				</button>
				<div className="website-switcher__dropdown" hidden role="menu">
					<ul className="website-switcher__list">
						{ websites.map( ( website, index ) => (
							<li key={ index } className="website-switcher__item" role="none">
								<a
									href={ website.url }
									className="website-switcher__link"
									role="menuitem"
								>
									{ website.icon && (
										<img
											src={ website.icon }
											alt=""
											className="website-switcher__item-icon"
										/>
									) }
									<span className="website-switcher__item-name">
										{ website.name }
									</span>
								</a>
							</li>
						) ) }
					</ul>
				</div>
			</div>
		</div>
	);
}