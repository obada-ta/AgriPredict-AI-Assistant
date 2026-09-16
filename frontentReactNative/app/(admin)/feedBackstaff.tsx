import { BASE_URL } from "@/constants/Api";
import { COLORS } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

interface User {
  _id: string;
  name: string;
  email?: string;
  role?: string;
}

interface Feedback {
  _id: string;
  type: "query" | "complaint";
  message: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

const FeedBackStaff: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/feedbacks`);
      const data = await response.json();
      console.log("Fetched feedbacks:", data); // Debug log
      if (response.ok || response.status === 200) {
        setFeedbacks(data);
      } else {
        Alert.alert("Error", data.error || "Failed to fetch feedbacks");
      }
    } catch (error: any) {
      console.error("Fetch error:", error); // Debug log
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Feedback",
      "Are you sure you want to delete this feedback?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteFeedback(id),
        },
      ]
    );
  };

  const deleteFeedback = async (id: string) => {
    try {
      console.log("Deleting feedback with ID:", id); // Debug log

      const response = await fetch(`${BASE_URL}/api/feedbacks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status); // Debug log

      const data = await response.json();
      console.log("Delete response data:", data); // Debug log

      if (response.ok) {
        Alert.alert("Deleted", data.message || "Feedback deleted");
        // تحديث القائمة محليًا بدلاً من إعادة جلبها
        setFeedbacks(prev => prev.filter(feedback => feedback._id !== id));
      } else {
        Alert.alert("Error", data.error || "Failed to delete feedback");
      }
    } catch (error: any) {
      console.error("Delete error:", error); // Debug log
      Alert.alert("Error", error.message || "Network error occurred");
    }
  };

  const renderItem = ({ item }: { item: Feedback }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text
          style={[
            styles.type,
            item.type === "query" ? styles.query : styles.complaint,
          ]}
        >
          {item.type.toUpperCase()}
        </Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user?.name || "Unknown User"}</Text>
          <Text style={styles.userEmail}>{item.user?.email || "No email"}</Text>
        </View>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Feedbacks</Text>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchFeedbacks();
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No feedbacks available.</Text>
        }
        contentContainerStyle={feedbacks.length === 0 && styles.emptyContainer}
      />
    </View>
  );
};

export default FeedBackStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  userInfo: {
    alignItems: "flex-end",
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  type: {
    fontWeight: "bold",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: COLORS.white,
    overflow: "hidden",
  },
  query: {
    backgroundColor: COLORS.secondary,
  },
  complaint: {
    backgroundColor: COLORS.error,
  },
  message: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 12,
    fontStyle: "italic",
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textLight,
    marginTop: 50,
    fontSize: 16,
  },
});