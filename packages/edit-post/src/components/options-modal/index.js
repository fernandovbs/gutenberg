/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { withViewportMatch } from '@wordpress/viewport';
import { Modal } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	PostTaxonomies,
	PostExcerptCheck,
	PageAttributesCheck,
	PostFeaturedImageCheck,
	PostTypeSupportCheck,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import Section from './section';
import {
	EnablePluginDocumentSettingPanelOption,
	EnablePublishSidebarOption,
	EnableTipsOption,
	EnablePanelOption,
	EnableFeature,
} from './options';
import MetaBoxesSection from './meta-boxes-section';

const MODAL_NAME = 'edit-post/options';

export function OptionsModal( { isModalActive, isViewable, isSmallScreen, closeModal } ) {
	if ( ! isModalActive ) {
		return null;
	}

	return (
		<Modal
			className="edit-post-options-modal"
			title={ __( 'Options' ) }
			closeLabel={ __( 'Close' ) }
			onRequestClose={ closeModal }
		>
			{ ! isSmallScreen && (
				<Section title={ _x( 'View', 'noun' ) }>
					<EnableFeature
						feature="fixedToolbar"
						label={ __( 'Top Toolbar' ) }
						help={ __( 'Access all block and document tools in a single place' ) }
					/>
					<EnableFeature
						feature="focusMode"
						label={ __( 'Spotlight Mode' ) }
						help={ __( 'Focus on one block at a time' ) }
					/>
					<EnableFeature
						feature="fullscreenMode"
						label={ __( 'Fullscreen Mode' ) }
						help={ __( 'Work without distraction' ) }
					/>
				</Section>
			) }
			<Section title={ __( 'General' ) }>
				<EnablePublishSidebarOption label={ __( 'Pre-publish Checks' ) } />
				<EnableTipsOption label={ __( 'Tips' ) } />
				<EnableFeature feature="showInserterHelpPanel" label={ __( 'Inserter Help Panel' ) } />
			</Section>
			<Section title={ __( 'Document Panels' ) }>
				<EnablePluginDocumentSettingPanelOption.Slot />
				{ isViewable && (
					<EnablePanelOption label={ __( 'Permalink' ) } panelName="post-link" />
				) }
				<PostTaxonomies
					taxonomyWrapper={ ( content, taxonomy ) => (
						<EnablePanelOption
							label={ get( taxonomy, [ 'labels', 'menu_name' ] ) }
							panelName={ `taxonomy-panel-${ taxonomy.slug }` }
						/>
					) }
				/>
				<PostFeaturedImageCheck>
					<EnablePanelOption label={ __( 'Featured Image' ) } panelName="featured-image" />
				</PostFeaturedImageCheck>
				<PostExcerptCheck>
					<EnablePanelOption label={ __( 'Excerpt' ) } panelName="post-excerpt" />
				</PostExcerptCheck>
				<PostTypeSupportCheck supportKeys={ [ 'comments', 'trackbacks' ] }>
					<EnablePanelOption label={ __( 'Discussion' ) } panelName="discussion-panel" />
				</PostTypeSupportCheck>
				<PageAttributesCheck>
					<EnablePanelOption label={ __( 'Page Attributes' ) } panelName="page-attributes" />
				</PageAttributesCheck>
			</Section>
			<MetaBoxesSection title={ __( 'Advanced Panels' ) } />
		</Modal>
	);
}

export default compose(
	withViewportMatch( { isSmallScreen: '< medium' } ),
	withSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );
		const { getPostType } = select( 'core' );
		const postType = getPostType( getEditedPostAttribute( 'type' ) );

		return {
			isModalActive: select( 'core/edit-post' ).isModalActive( MODAL_NAME ),
			isViewable: get( postType, [ 'viewable' ], false ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			closeModal: () => dispatch( 'core/edit-post' ).closeModal(),
		};
	} )
)( OptionsModal );
