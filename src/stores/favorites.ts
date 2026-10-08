import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";


export const useFavoritesStore = defineStore(
  "favorites",
  () => {

    // 从本地读取
    const favoriteIds = ref<number[]>(
      JSON.parse(
        localStorage.getItem("favorites") || "[]"
      )
    );


    // 数量
    const count = computed(() => {
      return favoriteIds.value.length;
    });


    // 判断是否收藏
    const isFavorite = (id:number) => {
      return favoriteIds.value.includes(id);
    };


    // 添加/取消
    const toggle = (id:number) => {

      if(isFavorite(id)){

        favoriteIds.value =
          favoriteIds.value.filter(
            item => item !== id
          );

      }else{

        favoriteIds.value.push(id);

      }

    };


    // 监听变化保存
    watch(
      favoriteIds,
      (value)=>{

        localStorage.setItem(
          "favorites",
          JSON.stringify(value)
        );

      },
      {
        deep:true
      }
    );


    return {
      favoriteIds,
      count,
      isFavorite,
      toggle,
    };

  }
);