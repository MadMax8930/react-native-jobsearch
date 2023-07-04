import React, { useState, useCallback } from "react";
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";

import { Company, JobTabs, JobAbout, JobFooter, Specifics, ScreenHeaderBtn } from "../../components";
import { icons, COLORS, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
   const router = useRouter();
   const [refreshing, setRefreshing] = useState(false);
   const [activeTab, setActiveTab] = useState(tabs[0]);

   const params = useSearchParams();
   const { data, isLoading, error, refetch } = useFetch('job-details', { job_id: params.id });
   
   const onRefresh = useCallback(() => {
      setRefreshing(true);
      refetch();
      setRefreshing(false);
   }, []);

   displayTabContent = () => {
      switch (activeTab) {
         case "About":
            return <JobAbout info={data[0].job_description ?? "No data provided"} />
         case "Qualifications":
            return <Specifics title="Qualifications" points={data[0].job_highlights?.Qualifications ?? ["N/A"]} />
         case "Responsibilities":
            return <Specifics title="Responsibilities" points={data[0].job_highlights?.Responsibilities ?? ["N/A"]} />
         default:
            break;
      }
   }

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
         {/* Header */}
         <Stack.Screen
            options={{
               headerStyle: { backgroundColor: COLORS.lightWhite },
               headerShadowVisible: false,
               headerBackVisible: false,
               headerLeft: () => (
                  <ScreenHeaderBtn iconUrl={icons.left} dimension="60%" handlePress={() => router.back()} />
               ),
               headerRight: () => (
                  <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
               ),
               headerTitle: ""
            }}
         />
         {/* Body */}
         <>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
               {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
               ) :  error ? (
                  <Text>Something went wrong</Text>
               ) : data.length === 0 ? (
                  <Text>No data found</Text>
               ) : (
                  <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                     <Company
                        companyLogo={data[0].employer_logo}
                        companyName={data[0].employer_name}
                        jobTitle={data[0].job_title}
                        location={data[0].job_country}
                     />
                     <JobTabs 
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                     />
                     {displayTabContent()}
                  </View>
               )}
            </ScrollView>
            <JobFooter url={data[0]?.job_google_link ?? 'http://careers.google.com/jobs/results/'} />
         </>
      </SafeAreaView>
   )
}

export default JobDetails;