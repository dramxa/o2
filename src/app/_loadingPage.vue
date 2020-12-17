<template>
<v-container fluid class="login-bg d-flex" >
    <v-col cols="6" class="d-flex align-center justify-space-around">
        <!-- loading -->
        <v-card flat height="300px" class="content-block pa-5">
            <div>
                <!-- <img src="@/assets/logo.svg" alt="LogoO2" style="width:100%;"> -->
                <div class="login-page-logo"></div>
                <p class="fs-m blue800 text-center mt-12 pt-12 mb-2" >Loading authorization data...</p>
                <v-progress-linear class="blue600 login-progressbar" indeterminate rounded height="4"></v-progress-linear>
            </div>
        </v-card>
    </v-col>
    </v-container>
</template>

<style>
html{
    text-decoration: none !important;
    letter-spacing: none !important;
    font-family: 'PTRootUI', sans-serif !important;
  }

  .content-block{width: 290px;}
  .login-progressbar .v-progress-linear__determinate {background: linear-gradient(290.34deg, #637CEB 0%, #63A9EB 98.23%) !important;}

  .login-bg{
      background-position: right bottom;
      background-size: contain;
  }
</style>
