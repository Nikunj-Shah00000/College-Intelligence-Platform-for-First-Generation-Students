import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { CategoryCount, Confession, ConfessionInput, DashboardStats, FacultyInsight, FacultyInsightInput, GetNudgesParams, GetPowerMapParams, GetRoadmapParams, GetSurvivalGuideParams, HealthStatus, ListConfessionsParams, ListFacultyInsightsParams, ListNotificationsParams, ListTipsParams, Notification, NotificationInput, Nudge, PowerMap, Roadmap, SurvivalGuideSection, Tip, TipInput, TipPatch, User, UserInput, VerificationInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListUsersUrl: () => string;
export declare const listUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateUserUrl: () => string;
export declare const createUser: (userInput: UserInput, options?: RequestInit) => Promise<User>;
export declare const getCreateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<UserInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<UserInput>;
}, TContext>;
export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>;
export type CreateUserMutationBody = BodyType<UserInput>;
export type CreateUserMutationError = ErrorType<unknown>;
export declare const useCreateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<UserInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<UserInput>;
}, TContext>;
export declare const getGetUserUrl: (id: number) => string;
export declare const getUser: (id: number, options?: RequestInit) => Promise<User>;
export declare const getGetUserQueryKey: (id: number) => readonly [`/api/users/${number}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<void>;
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListTipsUrl: (params?: ListTipsParams) => string;
export declare const listTips: (params?: ListTipsParams, options?: RequestInit) => Promise<Tip[]>;
export declare const getListTipsQueryKey: (params?: ListTipsParams) => readonly ["/api/tips", ...ListTipsParams[]];
export declare const getListTipsQueryOptions: <TData = Awaited<ReturnType<typeof listTips>>, TError = ErrorType<unknown>>(params?: ListTipsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTips>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTips>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTipsQueryResult = NonNullable<Awaited<ReturnType<typeof listTips>>>;
export type ListTipsQueryError = ErrorType<unknown>;
export declare function useListTips<TData = Awaited<ReturnType<typeof listTips>>, TError = ErrorType<unknown>>(params?: ListTipsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTips>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateTipUrl: () => string;
export declare const createTip: (tipInput: TipInput, options?: RequestInit) => Promise<Tip>;
export declare const getCreateTipMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTip>>, TError, {
        data: BodyType<TipInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTip>>, TError, {
    data: BodyType<TipInput>;
}, TContext>;
export type CreateTipMutationResult = NonNullable<Awaited<ReturnType<typeof createTip>>>;
export type CreateTipMutationBody = BodyType<TipInput>;
export type CreateTipMutationError = ErrorType<unknown>;
export declare const useCreateTip: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTip>>, TError, {
        data: BodyType<TipInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTip>>, TError, {
    data: BodyType<TipInput>;
}, TContext>;
export declare const getGetTrendingTipsUrl: () => string;
export declare const getTrendingTips: (options?: RequestInit) => Promise<Tip[]>;
export declare const getGetTrendingTipsQueryKey: () => readonly ["/api/tips/trending"];
export declare const getGetTrendingTipsQueryOptions: <TData = Awaited<ReturnType<typeof getTrendingTips>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrendingTips>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTrendingTips>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTrendingTipsQueryResult = NonNullable<Awaited<ReturnType<typeof getTrendingTips>>>;
export type GetTrendingTipsQueryError = ErrorType<unknown>;
export declare function useGetTrendingTips<TData = Awaited<ReturnType<typeof getTrendingTips>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrendingTips>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetUrgentTipsUrl: () => string;
export declare const getUrgentTips: (options?: RequestInit) => Promise<Tip[]>;
export declare const getGetUrgentTipsQueryKey: () => readonly ["/api/tips/urgent"];
export declare const getGetUrgentTipsQueryOptions: <TData = Awaited<ReturnType<typeof getUrgentTips>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUrgentTips>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUrgentTips>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUrgentTipsQueryResult = NonNullable<Awaited<ReturnType<typeof getUrgentTips>>>;
export type GetUrgentTipsQueryError = ErrorType<unknown>;
export declare function useGetUrgentTips<TData = Awaited<ReturnType<typeof getUrgentTips>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUrgentTips>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetTipUrl: (id: number) => string;
export declare const getTip: (id: number, options?: RequestInit) => Promise<Tip>;
export declare const getGetTipQueryKey: (id: number) => readonly [`/api/tips/${number}`];
export declare const getGetTipQueryOptions: <TData = Awaited<ReturnType<typeof getTip>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTip>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTip>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTipQueryResult = NonNullable<Awaited<ReturnType<typeof getTip>>>;
export type GetTipQueryError = ErrorType<void>;
export declare function useGetTip<TData = Awaited<ReturnType<typeof getTip>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTip>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateTipUrl: (id: number) => string;
export declare const updateTip: (id: number, tipPatch: TipPatch, options?: RequestInit) => Promise<Tip>;
export declare const getUpdateTipMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTip>>, TError, {
        id: number;
        data: BodyType<TipPatch>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTip>>, TError, {
    id: number;
    data: BodyType<TipPatch>;
}, TContext>;
export type UpdateTipMutationResult = NonNullable<Awaited<ReturnType<typeof updateTip>>>;
export type UpdateTipMutationBody = BodyType<TipPatch>;
export type UpdateTipMutationError = ErrorType<void>;
export declare const useUpdateTip: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTip>>, TError, {
        id: number;
        data: BodyType<TipPatch>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTip>>, TError, {
    id: number;
    data: BodyType<TipPatch>;
}, TContext>;
export declare const getDeleteTipUrl: (id: number) => string;
export declare const deleteTip: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTipMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTip>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTip>>, TError, {
    id: number;
}, TContext>;
export type DeleteTipMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTip>>>;
export type DeleteTipMutationError = ErrorType<void>;
export declare const useDeleteTip: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTip>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTip>>, TError, {
    id: number;
}, TContext>;
export declare const getVerifyTipUrl: (id: number) => string;
export declare const verifyTip: (id: number, verificationInput: VerificationInput, options?: RequestInit) => Promise<Tip>;
export declare const getVerifyTipMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyTip>>, TError, {
        id: number;
        data: BodyType<VerificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyTip>>, TError, {
    id: number;
    data: BodyType<VerificationInput>;
}, TContext>;
export type VerifyTipMutationResult = NonNullable<Awaited<ReturnType<typeof verifyTip>>>;
export type VerifyTipMutationBody = BodyType<VerificationInput>;
export type VerifyTipMutationError = ErrorType<void>;
export declare const useVerifyTip: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyTip>>, TError, {
        id: number;
        data: BodyType<VerificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyTip>>, TError, {
    id: number;
    data: BodyType<VerificationInput>;
}, TContext>;
export declare const getUnverifyTipUrl: (id: number) => string;
export declare const unverifyTip: (id: number, options?: RequestInit) => Promise<Tip>;
export declare const getUnverifyTipMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unverifyTip>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unverifyTip>>, TError, {
    id: number;
}, TContext>;
export type UnverifyTipMutationResult = NonNullable<Awaited<ReturnType<typeof unverifyTip>>>;
export type UnverifyTipMutationError = ErrorType<void>;
export declare const useUnverifyTip: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unverifyTip>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unverifyTip>>, TError, {
    id: number;
}, TContext>;
export declare const getListNotificationsUrl: (params?: ListNotificationsParams) => string;
export declare const listNotifications: (params?: ListNotificationsParams, options?: RequestInit) => Promise<Notification[]>;
export declare const getListNotificationsQueryKey: (params?: ListNotificationsParams) => readonly ["/api/notifications", ...ListNotificationsParams[]];
export declare const getListNotificationsQueryOptions: <TData = Awaited<ReturnType<typeof listNotifications>>, TError = ErrorType<unknown>>(params?: ListNotificationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof listNotifications>>>;
export type ListNotificationsQueryError = ErrorType<unknown>;
export declare function useListNotifications<TData = Awaited<ReturnType<typeof listNotifications>>, TError = ErrorType<unknown>>(params?: ListNotificationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateNotificationUrl: () => string;
export declare const createNotification: (notificationInput: NotificationInput, options?: RequestInit) => Promise<Notification>;
export declare const getCreateNotificationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNotification>>, TError, {
        data: BodyType<NotificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createNotification>>, TError, {
    data: BodyType<NotificationInput>;
}, TContext>;
export type CreateNotificationMutationResult = NonNullable<Awaited<ReturnType<typeof createNotification>>>;
export type CreateNotificationMutationBody = BodyType<NotificationInput>;
export type CreateNotificationMutationError = ErrorType<unknown>;
export declare const useCreateNotification: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNotification>>, TError, {
        data: BodyType<NotificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createNotification>>, TError, {
    data: BodyType<NotificationInput>;
}, TContext>;
export declare const getMarkNotificationReadUrl: (id: number) => string;
export declare const markNotificationRead: (id: number, options?: RequestInit) => Promise<Notification>;
export declare const getMarkNotificationReadMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: number;
}, TContext>;
export type MarkNotificationReadMutationResult = NonNullable<Awaited<ReturnType<typeof markNotificationRead>>>;
export type MarkNotificationReadMutationError = ErrorType<void>;
export declare const useMarkNotificationRead: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: number;
}, TContext>;
export declare const getGetDashboardStatsUrl: () => string;
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCategoryBreakdownUrl: () => string;
export declare const getCategoryBreakdown: (options?: RequestInit) => Promise<CategoryCount[]>;
export declare const getGetCategoryBreakdownQueryKey: () => readonly ["/api/stats/categories"];
export declare const getGetCategoryBreakdownQueryOptions: <TData = Awaited<ReturnType<typeof getCategoryBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCategoryBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCategoryBreakdown>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCategoryBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryBreakdown>>>;
export type GetCategoryBreakdownQueryError = ErrorType<unknown>;
export declare function useGetCategoryBreakdown<TData = Awaited<ReturnType<typeof getCategoryBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCategoryBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListConfessionsUrl: (params?: ListConfessionsParams) => string;
/**
 * @summary List anonymous confessions on the "What Nobody Tells You" wall
 */
export declare const listConfessions: (params?: ListConfessionsParams, options?: RequestInit) => Promise<Confession[]>;
export declare const getListConfessionsQueryKey: (params?: ListConfessionsParams) => readonly ["/api/confessions", ...ListConfessionsParams[]];
export declare const getListConfessionsQueryOptions: <TData = Awaited<ReturnType<typeof listConfessions>>, TError = ErrorType<unknown>>(params?: ListConfessionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConfessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listConfessions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListConfessionsQueryResult = NonNullable<Awaited<ReturnType<typeof listConfessions>>>;
export type ListConfessionsQueryError = ErrorType<unknown>;
/**
 * @summary List anonymous confessions on the "What Nobody Tells You" wall
 */
export declare function useListConfessions<TData = Awaited<ReturnType<typeof listConfessions>>, TError = ErrorType<unknown>>(params?: ListConfessionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConfessions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateConfessionUrl: () => string;
/**
 * @summary Anonymously post a confession
 */
export declare const createConfession: (confessionInput: ConfessionInput, options?: RequestInit) => Promise<Confession>;
export declare const getCreateConfessionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createConfession>>, TError, {
        data: BodyType<ConfessionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createConfession>>, TError, {
    data: BodyType<ConfessionInput>;
}, TContext>;
export type CreateConfessionMutationResult = NonNullable<Awaited<ReturnType<typeof createConfession>>>;
export type CreateConfessionMutationBody = BodyType<ConfessionInput>;
export type CreateConfessionMutationError = ErrorType<unknown>;
/**
* @summary Anonymously post a confession
*/
export declare const useCreateConfession: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createConfession>>, TError, {
        data: BodyType<ConfessionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createConfession>>, TError, {
    data: BodyType<ConfessionInput>;
}, TContext>;
export declare const getUpvoteConfessionUrl: (id: number) => string;
/**
 * @summary Upvote a confession
 */
export declare const upvoteConfession: (id: number, options?: RequestInit) => Promise<Confession>;
export declare const getUpvoteConfessionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof upvoteConfession>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof upvoteConfession>>, TError, {
    id: number;
}, TContext>;
export type UpvoteConfessionMutationResult = NonNullable<Awaited<ReturnType<typeof upvoteConfession>>>;
export type UpvoteConfessionMutationError = ErrorType<void>;
/**
* @summary Upvote a confession
*/
export declare const useUpvoteConfession: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof upvoteConfession>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof upvoteConfession>>, TError, {
    id: number;
}, TContext>;
export declare const getListFacultyInsightsUrl: (params?: ListFacultyInsightsParams) => string;
/**
 * @summary List crowdsourced faculty behaviour insights (Office Hour Intelligence)
 */
export declare const listFacultyInsights: (params?: ListFacultyInsightsParams, options?: RequestInit) => Promise<FacultyInsight[]>;
export declare const getListFacultyInsightsQueryKey: (params?: ListFacultyInsightsParams) => readonly ["/api/faculty-insights", ...ListFacultyInsightsParams[]];
export declare const getListFacultyInsightsQueryOptions: <TData = Awaited<ReturnType<typeof listFacultyInsights>>, TError = ErrorType<unknown>>(params?: ListFacultyInsightsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFacultyInsights>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFacultyInsights>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFacultyInsightsQueryResult = NonNullable<Awaited<ReturnType<typeof listFacultyInsights>>>;
export type ListFacultyInsightsQueryError = ErrorType<unknown>;
/**
 * @summary List crowdsourced faculty behaviour insights (Office Hour Intelligence)
 */
export declare function useListFacultyInsights<TData = Awaited<ReturnType<typeof listFacultyInsights>>, TError = ErrorType<unknown>>(params?: ListFacultyInsightsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFacultyInsights>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateFacultyInsightUrl: () => string;
export declare const createFacultyInsight: (facultyInsightInput: FacultyInsightInput, options?: RequestInit) => Promise<FacultyInsight>;
export declare const getCreateFacultyInsightMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFacultyInsight>>, TError, {
        data: BodyType<FacultyInsightInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFacultyInsight>>, TError, {
    data: BodyType<FacultyInsightInput>;
}, TContext>;
export type CreateFacultyInsightMutationResult = NonNullable<Awaited<ReturnType<typeof createFacultyInsight>>>;
export type CreateFacultyInsightMutationBody = BodyType<FacultyInsightInput>;
export type CreateFacultyInsightMutationError = ErrorType<unknown>;
export declare const useCreateFacultyInsight: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFacultyInsight>>, TError, {
        data: BodyType<FacultyInsightInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFacultyInsight>>, TError, {
    data: BodyType<FacultyInsightInput>;
}, TContext>;
export declare const getVerifyFacultyInsightUrl: (id: number) => string;
/**
 * @summary Verify / upvote a faculty insight
 */
export declare const verifyFacultyInsight: (id: number, options?: RequestInit) => Promise<FacultyInsight>;
export declare const getVerifyFacultyInsightMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyFacultyInsight>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyFacultyInsight>>, TError, {
    id: number;
}, TContext>;
export type VerifyFacultyInsightMutationResult = NonNullable<Awaited<ReturnType<typeof verifyFacultyInsight>>>;
export type VerifyFacultyInsightMutationError = ErrorType<void>;
/**
* @summary Verify / upvote a faculty insight
*/
export declare const useVerifyFacultyInsight: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyFacultyInsight>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyFacultyInsight>>, TError, {
    id: number;
}, TContext>;
export declare const getGetNudgesUrl: (params?: GetNudgesParams) => string;
/**
 * @summary Get personalised AI nudges for a student
 */
export declare const getNudges: (params?: GetNudgesParams, options?: RequestInit) => Promise<Nudge[]>;
export declare const getGetNudgesQueryKey: (params?: GetNudgesParams) => readonly ["/api/nudges", ...GetNudgesParams[]];
export declare const getGetNudgesQueryOptions: <TData = Awaited<ReturnType<typeof getNudges>>, TError = ErrorType<unknown>>(params?: GetNudgesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNudges>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNudges>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNudgesQueryResult = NonNullable<Awaited<ReturnType<typeof getNudges>>>;
export type GetNudgesQueryError = ErrorType<unknown>;
/**
 * @summary Get personalised AI nudges for a student
 */
export declare function useGetNudges<TData = Awaited<ReturnType<typeof getNudges>>, TError = ErrorType<unknown>>(params?: GetNudgesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNudges>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRoadmapUrl: (params?: GetRoadmapParams) => string;
/**
 * @summary Get the opportunity timeline / roadmap milestones
 */
export declare const getRoadmap: (params?: GetRoadmapParams, options?: RequestInit) => Promise<Roadmap>;
export declare const getGetRoadmapQueryKey: (params?: GetRoadmapParams) => readonly ["/api/roadmap", ...GetRoadmapParams[]];
export declare const getGetRoadmapQueryOptions: <TData = Awaited<ReturnType<typeof getRoadmap>>, TError = ErrorType<unknown>>(params?: GetRoadmapParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRoadmap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRoadmap>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRoadmapQueryResult = NonNullable<Awaited<ReturnType<typeof getRoadmap>>>;
export type GetRoadmapQueryError = ErrorType<unknown>;
/**
 * @summary Get the opportunity timeline / roadmap milestones
 */
export declare function useGetRoadmap<TData = Awaited<ReturnType<typeof getRoadmap>>, TError = ErrorType<unknown>>(params?: GetRoadmapParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRoadmap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPowerMapUrl: (params?: GetPowerMapParams) => string;
/**
 * @summary Get campus power-map graph data (clubs, professors, pipelines)
 */
export declare const getPowerMap: (params?: GetPowerMapParams, options?: RequestInit) => Promise<PowerMap>;
export declare const getGetPowerMapQueryKey: (params?: GetPowerMapParams) => readonly ["/api/power-map", ...GetPowerMapParams[]];
export declare const getGetPowerMapQueryOptions: <TData = Awaited<ReturnType<typeof getPowerMap>>, TError = ErrorType<unknown>>(params?: GetPowerMapParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPowerMap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPowerMap>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPowerMapQueryResult = NonNullable<Awaited<ReturnType<typeof getPowerMap>>>;
export type GetPowerMapQueryError = ErrorType<unknown>;
/**
 * @summary Get campus power-map graph data (clubs, professors, pipelines)
 */
export declare function useGetPowerMap<TData = Awaited<ReturnType<typeof getPowerMap>>, TError = ErrorType<unknown>>(params?: GetPowerMapParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPowerMap>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSurvivalGuideUrl: (params?: GetSurvivalGuideParams) => string;
/**
 * @summary Get aggregated department survival guide sections
 */
export declare const getSurvivalGuide: (params?: GetSurvivalGuideParams, options?: RequestInit) => Promise<SurvivalGuideSection[]>;
export declare const getGetSurvivalGuideQueryKey: (params?: GetSurvivalGuideParams) => readonly ["/api/survival-guide", ...GetSurvivalGuideParams[]];
export declare const getGetSurvivalGuideQueryOptions: <TData = Awaited<ReturnType<typeof getSurvivalGuide>>, TError = ErrorType<unknown>>(params?: GetSurvivalGuideParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSurvivalGuide>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSurvivalGuide>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSurvivalGuideQueryResult = NonNullable<Awaited<ReturnType<typeof getSurvivalGuide>>>;
export type GetSurvivalGuideQueryError = ErrorType<unknown>;
/**
 * @summary Get aggregated department survival guide sections
 */
export declare function useGetSurvivalGuide<TData = Awaited<ReturnType<typeof getSurvivalGuide>>, TError = ErrorType<unknown>>(params?: GetSurvivalGuideParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSurvivalGuide>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map