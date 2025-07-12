# File Organization Summary

## Updated File Structure for Customer Pages

### Dashboard Files (Display/Manage existing data)
| File Name | Purpose | Route | Used For |
|-----------|---------|-------|----------|
| `PickupDashboard.tsx` | Display all pickup requests | `/request-pickup` | Customer dashboard - View all pickup requests |
| `ServiceBookingDashboard.tsx` | Display all service bookings | `/service-booking` | Customer dashboard - View all service bookings |

### Form Files (Create new entries)
| File Name | Purpose | Route | Used For |
|-----------|---------|-------|----------|
| `RequestPickup.tsx` | Create new pickup request | `/new-pickup-request` | Services page - Form to request pickup |
| `BookService.tsx` | Book a service | `/book-service` | Services page - Form to book service |

## Route Configuration

### Customer Dashboard Routes
- `/request-pickup` → Shows `PickupDashboard` (displays all pickup requests)
- `/service-booking` → Shows `ServiceBookingDashboard` (displays all service bookings)
- `/new-pickup-request` → Shows `RequestPickup` form (create new pickup request)

### Guest/Service Routes
- Services page can link to `/book-service` for booking services
- Services page can link to `/new-pickup-request` for requesting pickups

## Key Changes Made

1. **Renamed Files:**
   - `RequestPickup.tsx` → `PickupDashboard.tsx` (dashboard)
   - `RequestPickupNew.tsx` → `RequestPickup.tsx` (form)
   - `ServiceBooking.tsx` → `ServiceBookingDashboard.tsx` (dashboard)
   - `BookService.tsx` → `BookService.tsx` (kept same - form)

2. **Updated Component Names:**
   - `RequestPickup` → `PickupDashboard`
   - `ServiceBooking` → `ServiceBookingDashboard`

3. **Updated Routes:**
   - `/request-pickup` now shows pickup requests dashboard
   - `/service-booking` now shows service bookings dashboard
   - `/new-pickup-request` shows pickup request form

## API Endpoints Used

### PickupDashboard.tsx
- `GET http://localhost:5000/api/user/get-all-pickup-request` - Fetch all pickup requests

### ServiceBookingDashboard.tsx
- `GET http://localhost:5000/api/user/all-bookings` - Fetch all service bookings
- `POST http://localhost:5000/api/user/purchase` - Process payments
- `PUT http://localhost:5000/api/user/update-booking` - Update booking details
- `DELETE http://localhost:5000/api/user/delete-booking/:id` - Delete booking

### RequestPickup.tsx
- `POST http://localhost:5000/api/user/add-pickup-request` - Create new pickup request

### BookService.tsx
- API endpoint for booking services (implementation may vary)

## Navigation Flow

1. **Customer Dashboard**: Users see overview and can navigate to different sections
2. **Pickup Management**: 
   - Click "Request Pickup" → See all pickup requests (`PickupDashboard`)
   - From services → Create new pickup request (`RequestPickup` form)
3. **Service Management**:
   - Click "Service Booking" → See all service bookings (`ServiceBookingDashboard`)
   - From services → Book new service (`BookService` form)
