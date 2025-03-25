<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter()


</script>

<template>
    <div class="welcomeFlex">
        <h1>
            Welcome to Weather API, an application that will provide you all the necessary info about the weather
        </h1>
        <div class="authentication" @click="">
            <span class="signInUp">
                <a>Sign in</a>
            </span>
            <span class="signInUp">
                <a>Sign up</a>
            </span>
        </div>
    </div>
    <br>
    <p>This application is aimed at a few things:</p>
</template>

<style>

.signInUp{
    margin: 80px;
    padding: 10px;
    background-color: rgb(209, 240, 230);
    border-radius: 5px;
    cursor: pointer;
    a{
        text-decoration: none;
        font-size: 18px;
        color: #8f8f8f;
    }


}
.signInUp:hover{
    background-color: #5ca5a3; ;
    a{
        color: #5f5d5d;;
    }
}


.welcomeFlex{
    display: flex;
    flex-direction: column;
    height: 50%;
    width: 500px;
    color: #727272;
    text-align: center;
}
    
</style>