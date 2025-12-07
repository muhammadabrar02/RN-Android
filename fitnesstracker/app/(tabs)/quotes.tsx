// app/(tabs)/quotes.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { Quote, RefreshCw, Share2, Heart } from 'lucide-react-native';

const initialQuotes = [
  {
    id: '1',
    text: 'The only bad workout is the one that didn\'t happen.',
    author: 'Unknown',
    category: 'Motivation',
    liked: false,
  },
  {
    id: '2',
    text: 'Your body can stand almost anything. It\'s your mind you have to convince.',
    author: 'Unknown',
    category: 'Mindset',
    liked: true,
  },
  {
    id: '3',
    text: 'Don\'t wish for a good body, work for it.',
    author: 'Unknown',
    category: 'Hard Work',
    liked: false,
  },
  {
    id: '4',
    text: 'The pain you feel today will be the strength you feel tomorrow.',
    author: 'Arnold Schwarzenegger',
    category: 'Perseverance',
    liked: false,
  },
  {
    id: '5',
    text: 'Success usually comes to those who are too busy to be looking for it.',
    author: 'Henry David Thoreau',
    category: 'Focus',
    liked: true,
  },
];

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [refreshing, setRefreshing] = useState(false);

  const toggleLike = (id: string) => {
    setQuotes(prev =>
      prev.map(quote =>
        quote.id === id ? { ...quote, liked: !quote.liked } : quote
      )
    );
  };

  const shareQuote = async (quote: { text: string; author: string }) => {
    try {
      await Share.share({
        message: `"${quote.text}" - ${quote.author}\n\nShared from Fitness App`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const refreshQuotes = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderQuoteItem = ({ item }: { item: any }) => (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>"{item.text}"</Text>
      <Text style={styles.quoteAuthor}>- {item.author}</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.quoteCategory}>{item.category}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleLike(item.id)}
          >
            <Heart
              size={20}
              color={item.liked ? '#EF4444' : '#9CA3AF'}
              fill={item.liked ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => shareQuote(item)}
          >
            <Share2 size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Motivation</Text>
        <TouchableOpacity onPress={refreshQuotes} style={styles.refreshButton}>
          <RefreshCw size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={quotes}
        renderItem={renderQuoteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={refreshQuotes}
        ListHeaderComponent={
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {quotes.filter(q => q.liked).length} liked quotes
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  statsContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: '500',
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  quoteCategory: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 6,
  },
});