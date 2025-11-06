import { useQuery } from "@tanstack/react-query";
import { getClientMe } from "@/api/endpoints/client";

export const useClientMe = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["clientMe"],
        queryFn: getClientMe,
        enabled,
        staleTime: Infinity,
        retry: false,
    });
};
