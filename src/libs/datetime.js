export function dbTimeForHuman(str) {
  // Konversi waktu dari string ISO 8601 ke objek Date
  const date = new Date(str);

  // Buat objek formatter dengan zona waktu Indonesia Tengah (WITA)
  const formatter = new Intl.DateTimeFormat('en-ID', {
    timeZone: 'Asia/Makassar', // Zona waktu Indonesia Tengah
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Gunakan format 24 jam
  });

  // Format waktu menggunakan formatter
  const formattedTime = formatter.format(date);

  return formattedTime;
}
