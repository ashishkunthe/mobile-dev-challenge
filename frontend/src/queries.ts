import { gql } from "@apollo/client";

const GET_NOODLES = gql`
  query GetNoodles {
    instantNoodles {
      id
      name
      spicinessLevel
      originCountry
    }
  }
`;

export default GET_NOODLES;
