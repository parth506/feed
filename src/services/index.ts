/**
 * Services package — client-side service layer.
 *
 * Convention:
 *   - Services wrap the api/* modules with caching, transformation, or
 *     business-specific data shaping.
 *   - Pages and components import from services, NOT from api/ directly,
 *     unless the call is trivial.
 *
 * Example:
 *   export const feedbackService = {
 *     list: (params) => api.get<PaginatedApiResponse<Feedback>>('/api/v1/feedback', { params }),
 *   };
 */
