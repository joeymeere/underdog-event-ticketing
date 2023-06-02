export interface EventProps {
  id: string;
  data: {
    name: string;
    description: string;
    image: string;
    location: {
      isRemote: boolean;
      country: string;
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    startTime: number;
    totalTickets: number;
    ticketsIssued: number;
    collectionId: string;
  };
}

export interface HandleEventCreaton {
  name: string;
  description: string;
  image: string;
  location: {
    isRemote: boolean;
    country: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  isTransferable: boolean;
  isPaywalled: boolean;
  isCapped: boolean;
  ticketPrice: number;
  totalTickets: number;
  startTime: number;
}
