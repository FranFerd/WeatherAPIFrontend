<script setup>

</script>

<template>
    <section>
    <nav>
        <ul class="menuItems">
        <li><a href='#' data-item='Home'>Home</a></li>
        <li><a href='#' data-item='Weather today'>Weather today</a></li>
        <li><a href='#' data-item='Weather for a week'>Weather for a week</a></li>
        <!-- <li><a href='#' data-item='Blog'>Blog</a></li> -->
        <!-- <li><a href='#' data-item='Contact'>Contact</a></li> -->
        
        </ul>
    </nav>

    </section>

</template>

<style>
* {
  padding: 0;
  margin: 0;
}

body {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: relative;
  min-height: 100vh;
  font-family: Hack, monospace;
}

div {
  color: #727272;
  text-align: center;
}


nav {
  border-radius: 5px;
  margin-bottom: 25px;
  background: #feffda;
  padding: 16px;
  .menuItems {
    list-style: none;
    display: flex;

    li {
      margin: 50px;

      a {
        text-decoration: none;
        color: #8f8f8f;
        font-size: 24px;
        font-weight: 400;
        transition: all 0.2s ease-in-out;
        position: relative;
        text-transform: uppercase;
      
      }
      a:hover{
        color: #7cdfdb;
        text-shadow: 0px -1px 0px #5da9a7 ;
      }
    }
  }
}

</style>