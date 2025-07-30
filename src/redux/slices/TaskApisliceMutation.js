import {
  createTask,
  duplicateTask,
} from "../../../../server/controllers/taskController";
import { apiSlice } from "./ApisliceMutation";

export const injectedTaskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardstats: builder.query({
      query: () => ({
        url: "/task/dashboard",
        method: "GET",
        credentials: "include",
      }),
    }),
 getAlltasks: builder.query({
  query: ({ stage, isTrashed, search }) => ({
    url: `/task?stage=${stage}&isTrashed=${isTrashed}&search=${search}`,
    method: "GET",
    credentials: "include",
  }),
}),

    createTask: builder.mutation({
      query: (data) => ({
        url: "/task/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `/task/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: `/task/update/${data?._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `/task/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),
    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `/task/${id}`,
        method: "PUT",
        body: {},
        credentials: "include",
      }),
    }),
    getSingletask: builder.query({
      query: (id) => ({
        url: `/task/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    postTaskActivity:builder.mutation({
      query: ({ id, data }) => ({
        url: `/task/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
deleteRestoreTask: builder.mutation({
  query: ({ id, actionType }) => {
    const hasId = id && id !== "";
    return {
      url: hasId
        ? `/task/delete-restore/${id}?actionType=${actionType}`
        : `/task/delete-restore?actionType=${actionType}`,
      method: "DELETE",
      credentials: "include",
    };
  },
}),

  }),
});

export const {
  useGetDashboardstatsQuery,
  useGetAlltasksQuery,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useTrashTaskMutation,
  useCreateSubTaskMutation,
  useGetSingletaskQuery,
  usePostTaskActivityMutation,
  useDeleteRestoreTaskMutation,
  


} = injectedTaskApi;
