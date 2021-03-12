import {Injectable} from '@angular/core';
import {Album} from '../models/Album';
import {Artist} from '../models/Artist';
import {Genre} from '../models/Genre';
import {Track} from '../models/Track';
import {Playlist} from '../models/Playlist';
import {Settings} from 'common/core/config/settings.service';
import {User, USER_MODEL} from 'common/core/types/models/User';
import {slugifyString} from '@common/core/utils/slugify-string';
import {MixedArtist} from './artists/mixed-artist';
import {hasKey} from '@common/core/utils/has-key';

@Injectable({
    providedIn: 'root'
})
export class WebPlayerUrls {
    constructor(private settings: Settings) {}

    public album(album: Album, artist?: Artist|MixedArtist) {
        if ( ! artist) artist = album.artist;
        const artistName = artist ? artist.name : 'Various Artists';
        return ['/album', album.id, this.encodeItemName(artistName), this.encodeItemName(album.name)];
    }

    public artist(artist: Artist|MixedArtist, append?: string) {
        if (hasKey('artist_type', artist) && artist.artist_type === USER_MODEL) {
            return this.user(artist);
        } else {
            const link = ['/artist', artist.id, this.encodeItemName(artist.name)];
            if (append) {
                link.push(append);
            }
            return link;
        }
    }

    public artistRadio(artist: Artist) {
        return ['radio/artist', artist.id, this.encodeItemName(artist.name)];
    }

    public trackRadio(track: Track) {
        return ['radio/track', track.id, this.encodeItemName(track.name)];
    }

    public genre(genre: Genre) {
        return ['/genre', this.encodeItemName(genre.name)];
    }

    public track(track: Track) {
        return ['/track', track.id, this.encodeItemName(track.name)];
    }

    public trackDownload(track: Track) {
        return this.settings.getBaseUrl(true) + 'secure/tracks/' + track.id + '/download';
    }

    public playlist(playlist: Playlist) {
        return ['/playlists', playlist.id, this.encodeItemName(playlist.name)];
    }

    public user(user: Partial<User> | MixedArtist, append?: string) {
        if ( ! user) return ['/'];
        const link = ['/user', user.id, this.encodeItemName(user['display_name'] || user['name'])];
        if (append) link.push(append);
        return link;
    }

    public search(query: string, tab?: string) {
        const link = ['/search', query || ''];
        if (tab) link.push(tab);
        return link;
    }

    public editArtist(artist: Artist): any[] {
        return ['admin/artists', artist.id, 'edit'];
    }

    public encodeItemName(name: string): string {
        if ( ! name) return '';
        return slugifyString(name);
    }

    public routerLinkToUrl(commands: any[]): string {
        const uri = commands.map(command => {
            if (typeof command === 'string') {
                command = this.encodeItemName(command);
            }
            return command;
        }).join('/').replace(/^\/|\/$/g, '');
        return (this.settings.getBaseUrl() + uri);
    }
}
