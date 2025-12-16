/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { PanelBody, TextControl, Button, Notice, SelectControl, ColorPicker } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block properties
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { websites, switcherIcon, buttonText, desktopPlacement, mobilePlacement, buttonBackgroundColor, buttonTextColor } = attributes;
	const [ isOpen, setIsOpen ] = useState( false );

	const updateWebsite = ( index, field, value ) => {
		const newWebsites = [ ...websites ];
		newWebsites[ index ][ field ] = value;
		setAttributes( { websites: newWebsites } );
	};

	const addWebsite = () => {
		setAttributes( {
			websites: [
				...websites,
				{ name: 'New Website', url: 'https://example.com', icon: '' },
			],
		} );
	};

	const removeWebsite = ( index ) => {
		const newWebsites = websites.filter( ( _, i ) => i !== index );
		setAttributes( { websites: newWebsites } );
	};

	const placementOptions = [
		{ label: __( 'Top Left', 'website-switcher' ), value: 'top-left' },
		{ label: __( 'Top Center', 'website-switcher' ), value: 'top-center' },
		{ label: __( 'Top Right', 'website-switcher' ), value: 'top-right' },
		{ label: __( 'Bottom Left', 'website-switcher' ), value: 'bottom-left' },
		{ label: __( 'Bottom Center', 'website-switcher' ), value: 'bottom-center' },
		{ label: __( 'Bottom Right', 'website-switcher' ), value: 'bottom-right' },
	];

	const blockProps = useBlockProps( {
		className: `placement-desktop-${desktopPlacement} placement-mobile-${mobilePlacement}`,
	} );

	const buttonStyle = {
		backgroundColor: buttonBackgroundColor,
		color: buttonTextColor,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Switcher Settings', 'website-switcher' ) }>
					<Notice status="info" isDismissible={ false }>
						{ __(
							'This switcher will be visible to all visitors on the frontend. Perfect for headers!',
							'website-switcher'
						) }
					</Notice>
					<TextControl
						label={ __( 'Button Text', 'website-switcher' ) }
						value={ buttonText }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
						help={ __(
							'Text to display on the switcher button',
							'website-switcher'
						) }
					/>
					<TextControl
						label={ __( 'Switcher Icon URL (Optional)', 'website-switcher' ) }
						value={ switcherIcon }
						onChange={ ( value ) =>
							setAttributes( { switcherIcon: value } )
						}
						help={ __(
							'URL to an icon image for the main switcher button',
							'website-switcher'
						) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Button Colors', 'website-switcher' ) } initialOpen={ true }>
					<div style={ { marginBottom: '16px' } }>
						<label style={ { display: 'block', marginBottom: '8px', fontWeight: '500' } }>
							{ __( 'Background Color', 'website-switcher' ) }
						</label>
						<ColorPicker
							color={ buttonBackgroundColor }
							onChangeComplete={ ( color ) =>
								setAttributes( { buttonBackgroundColor: color.hex } )
							}
							enableAlpha={ false }
						/>
						<div style={ { marginTop: '8px', fontSize: '12px', color: '#666' } }>
							{ __( 'Current:', 'website-switcher' ) } { buttonBackgroundColor }
						</div>
					</div>
					<div style={ { marginBottom: '16px' } }>
						<label style={ { display: 'block', marginBottom: '8px', fontWeight: '500' } }>
							{ __( 'Text Color', 'website-switcher' ) }
						</label>
						<ColorPicker
							color={ buttonTextColor }
							onChangeComplete={ ( color ) =>
								setAttributes( { buttonTextColor: color.hex } )
							}
							enableAlpha={ false }
						/>
						<div style={ { marginTop: '8px', fontSize: '12px', color: '#666' } }>
							{ __( 'Current:', 'website-switcher' ) } { buttonTextColor }
						</div>
					</div>
					<Button
						isSecondary
						onClick={ () => {
							setAttributes( {
								buttonBackgroundColor: '#0073aa',
								buttonTextColor: '#ffffff',
							} );
						} }
					>
						{ __( 'Reset to Defaults', 'website-switcher' ) }
					</Button>
				</PanelBody>
				<PanelBody title={ __( 'Placement', 'website-switcher' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Desktop Placement', 'website-switcher' ) }
						value={ desktopPlacement }
						options={ placementOptions }
						onChange={ ( value ) => setAttributes( { desktopPlacement: value } ) }
						help={ __( 'Position on desktop screens (768px and wider)', 'website-switcher' ) }
					/>
					<SelectControl
						label={ __( 'Mobile Placement', 'website-switcher' ) }
						value={ mobilePlacement }
						options={ placementOptions }
						onChange={ ( value ) => setAttributes( { mobilePlacement: value } ) }
						help={ __( 'Position on mobile screens (below 768px)', 'website-switcher' ) }
					/>
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'Placement controls work best when the block is placed in a wide or full-width container.',
							'website-switcher'
						) }
					</Notice>
				</PanelBody>
				<PanelBody
					title={ __( 'Websites', 'website-switcher' ) }
					initialOpen={ false }
				>
					{ websites.map( ( website, index ) => (
						<div
							key={ index }
							style={ {
								marginBottom: '20px',
								padding: '15px',
								border: '1px solid #ddd',
								borderRadius: '4px',
								backgroundColor: '#f9f9f9',
							} }
						>
							<h4 style={ { marginTop: 0 } }>
								{ __( 'Website', 'website-switcher' ) }{ ' ' }
								{ index + 1 }
							</h4>
							<TextControl
								label={ __( 'Name', 'website-switcher' ) }
								value={ website.name }
								onChange={ ( value ) =>
									updateWebsite( index, 'name', value )
								}
							/>
							<TextControl
								label={ __( 'URL', 'website-switcher' ) }
								value={ website.url }
								onChange={ ( value ) =>
									updateWebsite( index, 'url', value )
								}
								type="url"
							/>
							<TextControl
								label={ __( 'Icon URL (Optional)', 'website-switcher' ) }
								value={ website.icon }
								onChange={ ( value ) =>
									updateWebsite( index, 'icon', value )
								}
								help={ __(
									'Optional icon image URL',
									'website-switcher'
								) }
							/>
							<Button
								isDestructive
								onClick={ () => removeWebsite( index ) }
								style={ { marginTop: '10px' } }
							>
								{ __( 'Remove Website', 'website-switcher' ) }
							</Button>
						</div>
					) ) }
					<Button isPrimary onClick={ addWebsite }>
						{ __( 'Add Website', 'website-switcher' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="website-switcher">
					<button
						className="website-switcher__toggle"
						onClick={ () => setIsOpen( ! isOpen ) }
						type="button"
						style={ buttonStyle }
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
						<span className="website-switcher__arrow">▼</span>
					</button>
					{ isOpen && (
						<div className="website-switcher__dropdown">
							<ul className="website-switcher__list">
								{ websites.map( ( website, index ) => (
									<li
										key={ index }
										className="website-switcher__item"
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
									</li>
								) ) }
							</ul>
						</div>
					) }
				</div>
				<div className="website-switcher-notice" style={ { marginTop: '10px', fontSize: '12px', color: '#666' } }>
					{ __( '👆 Preview - visitors will see this on the frontend', 'website-switcher' ) }
				</div>
			</div>
		</>
	);
}