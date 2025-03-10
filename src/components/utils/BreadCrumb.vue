<template>
  <ul class="breadcrumb">
    <li v-for="(breadCrumb, index) in breadCrumbs" :key="index">
      <router-link
        v-if="breadCrumb.name !== $route.name"
        :to="breadCrumb.path"
        class="dx-state-hover dx-theme-text-color"
      >
        {{ breadCrumb.meta.title }}
      </router-link>
      <span v-else :class="{ 'root-part': breadCrumb.isRoot }">{{ title }}</span>
    </li>
  </ul>
</template>
<script setup>
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
// --
const { title } = defineProps({
  title: {
    type: String,
    default: "",
  },
});
// ----
const route = useRoute();
const router = useRouter();
const routes = router.getRoutes();
// ---
const breadCrumbs = [];
const matchedRoutes = route.matched;
function cleanParamsFromPath(sourcePath) {
  return sourcePath.replace(/(\/:).{2,}/gi, "");
}
_.forEach(matchedRoutes, (matchedRoute) => {
  if (matchedRoute.meta.parentRouteName) {
    let filteredRoute = null;
    filteredRoute = _.find(
      routes,
      (item) => item.name === matchedRoute.meta.parentRouteName
    );
    if (filteredRoute) {
      filteredRoute.path = cleanParamsFromPath(filteredRoute.path);
      filteredRoute.isRoot = filteredRoute.meta.parentRouteName === "root";
      breadCrumbs.push(filteredRoute);
    }
    filteredRoute = _.find(
      routes,
      (item) => cleanParamsFromPath(item.path) === cleanParamsFromPath(matchedRoute.path)
    );
    if (filteredRoute) {
      filteredRoute.path = cleanParamsFromPath(filteredRoute.path);
      filteredRoute.isRoot = filteredRoute.meta.parentRouteName === "root";
      breadCrumbs.push(filteredRoute);
    }
  }
});
</script>
<style lang="scss" scoped>
ul.breadcrumb {
  list-style: none;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 2rem 2rem;
  margin-block: 0;
  background: #f6f6f6;
  @at-root [class*="-dark"] & {
    background-color: #3f3f4b;
  }
}
ul.breadcrumb li {
  display: inline;
}
ul.breadcrumb li + li:before {
  padding: 0.5rem;
  content: "\3E";
}
ul.breadcrumb li a {
  color: #6f777b;
  @at-root [class*="-dark"] & {
    color: #d5d5d5;
  }
  text-decoration: none;
}
ul.breadcrumb li a:hover {
  text-decoration: underline;
}
ul.breadcrumb li span {
  content: unset;
  &.root-part {
    font-size: 1.5rem;
  }
}
</style>
