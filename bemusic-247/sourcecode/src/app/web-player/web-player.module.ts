import {NgModule} from '@angular/core';
import {NavSidebarComponent} from './nav-sidebar/nav-sidebar.component';
import {WebPlayerComponent} from './web-player.component';
import {SearchSlideoutPanelComponent} from './search/search-slideout-panel/search-slideout-panel.component';
import {WebPlayerRoutingModule} from './web-player-routing.module';
import {AlbumComponent} from './albums/album/album.component';
import {TrackListComponent} from './tracks/track-list/track-list.component';
import {QueueSidebarComponent} from './queue-sidebar/queue-sidebar.component';
import {FullscreenOverlayComponent} from './fullscreen-overlay/fullscreen-overlay.component';
import {LibraryTrackToggleButtonComponent} from './users/user-library/library-track-toggle-button/library-track-toggle-button.component';
import {LibraryTracksComponent} from './users/user-library/library-tracks/library-tracks.component';
import {LibraryAlbumsComponent} from './users/user-library/library-albums/library-albums.component';
import {LibraryArtistsComponent} from './users/user-library/library-artists/library-artists.component';
import {AlbumItemComponent} from './albums/album-item/album-item.component';
import {ArtistItemComponent} from './artists/artist-item/artist-item.component';
import {ArtistComponent} from './artists/artist/artist.component';
import {AlbumContextMenuComponent} from './albums/album-context-menu/album-context-menu.component';
import {CrupdatePlaylistModalComponent} from './playlists/crupdate-playlist-modal/crupdate-playlist-modal.component';
import {TrackContextMenuComponent} from './tracks/track-context-menu/track-context-menu.component';
import {ArtistContextMenuComponent} from './artists/artist-context-menu/artist-context-menu.component';
import {GenreComponent} from './genres/genre/genre.component';
import {ContextMenuPlaylistPanelComponent} from './context-menu/context-menu-playlist-panel/context-menu-playlist-panel.component';
import {PlaylistComponent} from './playlists/playlist/playlist.component';
import {SearchComponent} from './search/search/search.component';
import {UserItemComponent} from './users/user-item/user-item.component';
import {PlaylistTrackContextMenuComponent} from './playlists/playlist-track-context-menu/playlist-track-context-menu.component';
import {PlaylistContextMenuComponent} from './playlists/playlist-context-menu/playlist-context-menu.component';
import {TrackPageComponent} from './tracks/track-page/track-page.component';
import {RadioPageComponent} from './radio-page/radio-page.component';
import {ShareMediaItemModalComponent} from './context-menu/share-media-item-modal/share-media-item-modal.component';
import {LyricsModalComponent} from './lyrics/lyrics-modal/lyrics-modal.component';
import {UserLibraryComponent} from './users/user-library/user-library.component';
import {LibraryPlaylistsComponent} from './users/user-library/library-playlists/library-playlists.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {WEB_PLAYER_CONTEXT_MENUS} from './available-context-menus';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AVAILABLE_CONTEXT_MENUS} from '@common/core/ui/context-menu/available-context-menus';
import {MediaImageModule} from './shared/media-image/media-image.module';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {UploadsModule} from '@common/uploads/uploads.module';
import {ChannelShowComponent} from './channels/channel-show/channel-show.component';
import {ChannelContentComponent} from './channels/channel-show/channel-content/channel-content.component';
import {PlayHistoryComponent} from './users/user-library/play-history/play-history.component';
import {TrackItemComponent} from './tracks/track-item/track-item.component';
import {GenreItemComponent} from './genres/genre-item/genre-item.component';
import {TruncatedDescriptionComponent} from './tracks/track-page/truncated-description/truncated-description.component';
import {TrackEmbedComponent} from './tracks/track-embed/track-embed.component';
import {ChannelFallbackHostComponent} from './channels/channel-fallback-host/channel-fallback-host.component';
import {PagesModule} from '@common/core/pages/shared/pages.module';
import {LandingComponent} from './landing/landing.component';
import {CommentListComponent} from './tracks/track-page/comments/comment-list/comment-list.component';
import {CommentListItemComponent} from './tracks/track-page/comments/comment-list-item/comment-list-item.component';
import {WaveformModule} from './tracks/waveform/waveform.module';
import {MediaListItemModule} from './tracks/media-list-item/media-list-item.module';
import {NewCommentFormModule} from './tracks/new-comment-form/new-comment-form.module';
import {PlayerUiModule} from './player-ui.module';
import {TrackActionsBarModule} from './tracks/track-actions-bar/track-actions-bar.module';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {FormatPipesModule} from '@common/core/ui/format-pipes/format-pipes.module';
import {AdHostModule} from '@common/core/ui/ad-host/ad-host.module';
import {ContextMenuModule} from '@common/core/ui/context-menu/context-menu.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {MaterialNavbarModule} from '@common/core/ui/material-navbar/material-navbar.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CustomScrollbarModule} from '@common/core/ui/custom-scrollbar/custom-scrollbar.module';
import {MatMenuModule} from '@angular/material/menu';
import {EmptyRouteComponent} from '@common/core/ui/empty-route/empty-route.component';
import {TagMediaPageComponent} from './tags/tag-media-page/tag-media-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {HomepageHostComponent} from './homepage-host/homepage-host.component';

@NgModule({
    imports: [
        CommonModule,
        WebPlayerRoutingModule,
        UploadImageControlModule,
        PagesModule,
        WaveformModule,
        MediaListItemModule,
        NewCommentFormModule,
        PlayerUiModule,
        TrackActionsBarModule,
        TranslationsModule,
        FormatPipesModule,
        AdHostModule,
        ContextMenuModule,
        LoadingIndicatorModule,
        FormsModule,
        ReactiveFormsModule,
        NoResultsMessageModule,
        MaterialNavbarModule,
        CustomScrollbarModule,

        // material
        MatSidenavModule,
        MatDialogModule,
        DragDropModule,
        MediaImageModule,
        MatChipsModule,
        UploadsModule,
        MatTableModule,
        MatSortModule,
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule,
        MatTabsModule,
        MatCheckboxModule,
    ],
    declarations: [
        HomepageHostComponent,
        WebPlayerComponent,
        NavSidebarComponent,
        SearchSlideoutPanelComponent,
        AlbumComponent,
        TrackListComponent,
        QueueSidebarComponent,
        FullscreenOverlayComponent,
        LibraryTrackToggleButtonComponent,
        LibraryTracksComponent,
        LibraryAlbumsComponent,
        LibraryArtistsComponent,
        AlbumItemComponent,
        ArtistItemComponent,
        UserItemComponent,
        ArtistComponent,
        AlbumContextMenuComponent,
        CrupdatePlaylistModalComponent,
        TrackContextMenuComponent,
        ArtistContextMenuComponent,
        GenreComponent,
        TagMediaPageComponent,
        ContextMenuPlaylistPanelComponent,
        PlaylistComponent,
        SearchComponent,
        UserItemComponent,
        PlaylistTrackContextMenuComponent,
        PlaylistContextMenuComponent,
        RadioPageComponent,
        ShareMediaItemModalComponent,
        LyricsModalComponent,
        UserLibraryComponent,
        LibraryPlaylistsComponent,
        ChannelShowComponent,
        ChannelContentComponent,
        PlayHistoryComponent,
        TrackItemComponent,
        GenreItemComponent,
        TruncatedDescriptionComponent,
        TrackEmbedComponent,
        ChannelFallbackHostComponent,
        LandingComponent,
        EmptyRouteComponent,

        CommentListComponent,
        CommentListItemComponent,
        TrackPageComponent,
    ],
    providers: [
        {
            provide: AVAILABLE_CONTEXT_MENUS,
            useValue: WEB_PLAYER_CONTEXT_MENUS,
            multi: true,
        },
    ]
})
export class WebPlayerModule {}
