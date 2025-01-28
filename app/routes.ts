import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("signin", "./routes/Auth/SignIn.tsx"),

    layout("./Layouts/index.tsx", [
        index("./routes/Dashboard/Dashboard.tsx"),
        route("keuangan", "./routes/BookKeeping/List.tsx"),
    ]),
] satisfies RouteConfig;
