import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import { Image, Text, View } from "react-native";

interface Comment {
  _id: string;
  content: string;
  _creationTime: number;
  user: {
    fullname: string;
    image: string;
    username?: string;
  };
}

export default function Comment({ comment }: { comment: Comment }) {
  return (
    <View style={styles.commentContainer}>
      <Image 
        source={{ uri: comment.user.image }} 
        style={styles.commentAvatar} 
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>
          {comment.user.username || comment.user.fullname}
        </Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}