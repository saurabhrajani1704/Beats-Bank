import { saveAs } from 'file-saver';
import Papa from 'papaparse';

/**
 * @typedef {Object} Track
 * @property {string} name
 * @property {Object[]} artists
 * @property {string} artists[].name
 * @property {Object} album
 * @property {string} album.name
 */

/**
 * @typedef {Object} Playlist
 * @property {string} name
 * @property {Object} tracks
 * @property {Object[]} tracks.items
 * @property {Track} tracks.items[].track
 */

/**
 * Function to export a playlist to a CSV file.
 * @param {Playlist} playlist
 */
const exportToCSV = (playlist) => {
  const data = playlist.tracks.items.map(item => ({
    'Track Name': item.track.name,
    'Artist': item.track.artists.map(artist => artist.name).join(' & '),
    'Album': item.track.album.name,
  }));

  const csv = Papa.unparse(data);

  // Create a Blob with UTF-8 encoding and a BOM
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${playlist.name}.csv`);
};

export default exportToCSV;
