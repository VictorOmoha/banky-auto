// Photos of the Banky Auto lot, in public/images/.
const img = (file) => `${process.env.PUBLIC_URL}/images/${file}`;

export const lotPhotos = {
  frontRow: { src: img('lot-front-row.jpg'), alt: 'A row of Nissan, Honda and Acura cars parked on the Banky Auto lot' },
  acuraMaxima: { src: img('lot-acura-maxima.jpg'), alt: 'A white Acura Integra between a Honda Passport and a black Nissan Maxima on the lot' },
  maximaAltima: { src: img('lot-maxima-altima.jpg'), alt: 'A silver Nissan Maxima and Nissan Altima on the Banky Auto lot' },
  trucksSuvs: { src: img('lot-trucks-suvs.jpg'), alt: 'A Toyota Tundra, two Honda Passports and an Acura Integra on the lot' },
  entrance: { src: img('lot-entrance.jpg'), alt: 'The gated entrance to the Banky Auto lot, with cars parked inside' },
};
