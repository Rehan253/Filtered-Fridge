// import { create } from "zustand"
// import { devtools } from "zustand/middleware"
// import * as api from "../api"
// import { prepareTicketsData } from "../constants/Utils"

// export const getTicketsAction = async (index, size, status) => {
//     const response = await api.getTicketsApi(index, size, status)
//     return response
// }

// export const transferTicketAction = async (data) => {
//     const response = await api.transferTicketApi(data)
//     return response
// }

// export const getLocationsAction = async () => {
//     const response = await api.getLocationsApi()
//     return response.data
// }

// export const createTicketAction = async (data) => {
//     const response = await api.createTicketApi(data)
//     return response
// }

// const ticketStore = create(
//     devtools(
//         (set, get) => ({
//             tickets: [],
//             locations: [],
//             pageIndex: 1,
//             pageSize: 20,
//             totalCount: 0,
//             fetchStatus: "",
//             action: "",

//             fetchTickets: async (index, size, status) => {
//                 set({ fetchStatus: "loading", action: "fetchTickets" }, false, "fetchTickets/start")
//                 try {
//                     const response = await getTicketsAction(index, size, status)
//                     if (response && response.data) {
//                         const transformedTickets = prepareTicketsData(response.data)

//                         set(
//                             {
//                                 tickets: transformedTickets,
//                                 pageIndex: response.pageIndex || index,
//                                 pageSize: response.pageSize || size,
//                                 totalCount: response.count || 0,
//                                 fetchStatus: "success",
//                                 action: "fetchTickets"
//                             },
//                             false,
//                             "fetchTickets/success"
//                         )
//                     }
//                 } catch (err) {
//                     set({ fetchStatus: "error", action: "fetchTickets" }, false, "fetchTickets/error")
//                 }
//             },

//             fetchLocations: async () => {
//                 set({ fetchStatus: "loading", action: "fetchLocations" }, false, "fetchLocations/start")
//                 try {
//                     const response = await getLocationsAction()
//                     const options = response.locations.map((location) => ({
//                         value: location,
//                         label: location
//                     }))
//                     set(
//                         { locations: options, fetchStatus: "success", action: "fetchLocations" },
//                         false,
//                         "fetchLocations/success"
//                     )
//                 } catch (err) {
//                     set({ fetchStatus: "error", action: "fetchLocations" }, false, "fetchLocations/error")
//                 }
//             }
//         }),
//         { name: "ticketStore" }
//     )
// )

// export default ticketStore
