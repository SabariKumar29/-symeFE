export const navbarItems = [
  "How it works",
  "Influencer",
  "Companies",
  "Investors",
  "Contact",
];

export const categoryList = [
  { id: 1, value: "Spa & Luxury" },
  { id: 2, value: "Fashion" },
  { id: 3, value: "Food & Drink" },
  { id: 4, value: "Accommodation" },
  { id: 5, value: "Health & Fitness" },
  { id: 6, value: "Traveling" },
  { id: 7, value: "Cosmetics" },
  { id: 8, value: "Jewelry" },
  { id: 9, value: "Other" },
];

export const locationList = [
  { id: 1, value: "Chennai, India" },
  { id: 2, value: "New York City, USA" },
  { id: 3, value: "London, UK" },
  { id: 4, value: "Paris, France" },
  { id: 5, value: "Tokyo, Japan" },
  { id: 6, value: "Sydney, Australia" },
  { id: 7, value: "Rio de Janeiro, Brazil" },
  { id: 8, value: "Cape Town, South Africa" },
  { id: 9, value: "Dubai, UAE" },
  { id: 10, value: "Barcelona, Spain" },
];

export const offerStatusCode = {
  // Status when the offer is accepted by the company
  accept: { name: "Accept", bg: "primary" },

  // Status when the offer is pending approval
  pending: { name: "Pending approval", bg: "gray" },

  // Status for the check-in process
  check: { name: "check-in", bg: "secondary" },

  // Status when the offer is completed
  complete: { name: "Complete offer", bg: "blueLight" },
};

export const offerFilterCode = {
  pending: "requestToBusiness", // Offers that are requested by the influencer, pending company approval
  approved: "offeredToInfluencer", // Offers that have been approved and sent to the influencer
  completed: "completedByInfluencerUsers", // Offers that have been completed by the influencer
  rejected: "rejectedOffers", // Offers that have been rejected by the company
};
export const notificationCode = {
  offerRequested: "You have received an offer request from influencer",
  offerAccepted: "Your offer request has been approved by the company",
  offerCompleted: "The influencer has completed the offer",
  offerIgnored: "Your offer is rejected",
};

export const cancelOfferReason = [
  { id: 1, value: "Reputation Concerns" },
  { id: 2, value: "Poor Communication" },
  { id: 3, value: "Unclear Expectations" },
  { id: 4, value: "Creative Differences" },
  { id: 5, value: "Dispute" },
  { id: 6, value: "Personal Issues" },
  { id: 7, value: "Scheduling Conflicts" },
];

export const reportOfferReason = [
  { id: 1, value: "I don't like it" },
  { id: 2, value: "It does not fit here" },
  { id: 3, value: "Fraud or Scam" },
  { id: 4, value: "Misleading Information" },
  { id: 5, value: "Offensive Content" },
  { id: 6, value: "Copyright Infringement" },
];
export const filterDtlsInitialValue = {
  search: "",
  categories: [],
  location: [],
  availableDates: [],
  status: "active",
  businessId: "",
  influencerId: "",
  limit: "",
  sort: "",
  order: "",
  page: "",
};
