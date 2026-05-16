export type ApiUser = {
  id: number;
  login: string;
  full_name: string;
  role: string;
  terminal_id: number | null;
};

export type LoginResponse = {
  message: string;
  user: ApiUser;
};

export type CartResponse = {
  id: number;
  count: number;
};

export type CrossingPassenger = {
  passenger_id: number;
  full_name: string;
  passport_number: string;
  citizenship: string;
  seat_number: string;
  queue_number: number;
  decision: string;
  is_main: boolean;
  passport_image_url?: string;
};

export type CrossingDetail = {
  id: number;
  status: string;
  creator_login: string;
  moderator_login: string | null;
  flight_number: string;
  terminal_name: string;
  inspection_result: string;
  approved_count: number;
  passengers: CrossingPassenger[];
};

export type FlightListItem = {
  id: number;
  flight_number: string;
  status: string;
  terminal_name: string;
  direction: string;
  route_name: string;
  flight_date: string;
};

export type FlightPassenger = {
  id: number;
  full_name: string;
  seat_number: string;
  citizenship: string;
  passport_number: string;
  birth_date: string;
  expiry_date: string;
  description: string;
  previous_trips_count: number;
  image_url: string;
};

export type FlightDetail = {
  id: number;
  flight_number: string;
  status: string;
  terminal_name: string;
  direction: string;
  route_name: string;
  flight_date: string;
  passengers: FlightPassenger[];
};
