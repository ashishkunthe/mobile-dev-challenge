type Noodle = {
  id: string;
  name: string;
  brand: string;
  originCountry: string;
  spicinessLevel: number;
  rating: number;
  category?: {
    name: string;
  };
  imageURL: string;
};

export default Noodle;
