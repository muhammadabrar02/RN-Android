// app/(tabs)/index.tsx
import { Link } from 'expo-router';
import { Dumbbell, PlusCircle, Clock, Target, Award, Image as ImageIcon, RefreshCw } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Exercise } from './context/ExerciseContext';


import { useExercises } from './context/ExerciseContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { exercises, toggleComplete, deleteExercise } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  // Fetch images from Unsplash API (if you're using API)
  const fetchExerciseImage = async (exerciseId: string, category: string) => {
    try {
      setLoadingImages(prev => ({ ...prev, [exerciseId]: true }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock image URLs based on category
      const mockImages = {
        'Strength': [
          'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop',
        ],
        'Cardio': [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        ],
        'Flexibility': [
          'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1569511165-7d21faa0841b?w=800&auto=format&fit=crop',
        ],
        'Core': [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
        ],
        'HIIT': [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
        ],
        'Balance': [
          'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop',
        ],
      };
      
      const categoryImages = mockImages[category as keyof typeof mockImages] || mockImages.Strength;
      const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
      
      // In a real app, you would update the exercise with the image URL
      // For now, we're just returning it
      return randomImage;
      
    } catch (error) {
      console.error('Error fetching image:', error);
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop';
    } finally {
      setLoadingImages(prev => ({ ...prev, [exerciseId]: false }));
    }
  };

  // Fetch images on component mount (optional)
  useEffect(() => {
    exercises.forEach(exercise => {
      if (!exercise.image) {
        // You can fetch images here if needed
      }
    });
  }, [exercises]);

  const refreshImages = async () => {
    setRefreshing(true);
    // Refresh logic here
    setRefreshing(false);
  };

  const handleExercisePress = (exercise: any) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const renderDetailItem = (icon: React.ReactNode, label: string, value: string) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>{icon}</View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  const renderExerciseItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        item.completed && styles.completedCard,
      ]}
      onPress={() => handleExercisePress(item)}
      onLongPress={() => deleteExercise(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Image Section */}
        <View style={styles.cardImageContainer}>
          {loadingImages[item.id] ? (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Dumbbell size={40} color="#9CA3AF" />
            </View>
          )}
          <View style={[
            styles.statusIndicator,
            item.completed
              ? styles.completedIndicator
              : styles.pendingIndicator,
          ]} />
        </View>

        {/* Content Section */}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Dumbbell size={18} color="#3B82F6" />
              <Text style={styles.exerciseName}>{item.name}</Text>
            </View>
            <Text style={styles.durationText}>{item.duration} min</Text>
          </View>

          <Text style={styles.exerciseDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.exerciseDetails}>
            <View style={styles.tagsContainer}>
              <Text style={styles.categoryTag}>{item.category}</Text>
              <Text style={[
                styles.difficultyTag,
                item.difficulty === 'Beginner' && styles.beginnerTag,
                item.difficulty === 'Intermediate' && styles.intermediateTag,
                item.difficulty === 'Advanced' && styles.advancedTag,
              ]}>
                {item.difficulty}
              </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              {item.calories && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>🔥 {item.calories}</Text>
                  <Text style={styles.statLabel}>cal</Text>
                </View>
              )}
              {item.sets && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{item.sets}x{item.reps}</Text>
                  <Text style={styles.statLabel}>sets</Text>
                </View>
              )}
              {item.distance && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{item.distance}</Text>
                  <Text style={styles.statLabel}>dist</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Fitness Exercises</Text>
          <Text style={styles.subtitle}>{exercises.length} exercises in your list</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={refreshImages}
            disabled={refreshing}
          >
            <RefreshCw size={20} color="#3B82F6" />
          </TouchableOpacity>
          <Link href="/add-exercise" asChild>
            <TouchableOpacity style={styles.addButton}>
              <PlusCircle size={28} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Dumbbell size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No exercises added yet!</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add one</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refreshImages}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{exercises.length}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.completedStat]}>
              {exercises.filter(e => e.completed).length}
            </Text>
            <Text style={styles.statLabel}>COMPLETED</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {exercises.reduce((sum, ex) => sum + ex.duration, 0)}
            </Text>
            <Text style={styles.statLabel}>MINUTES</Text>
          </View>
        </View>
      </View>

      {/* Exercise Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exercise Details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Dumbbell size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {selectedExercise && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View style={styles.detailImageContainer}>
                  {selectedExercise.image ? (
                    <Image
                      source={{ uri: selectedExercise.image }}
                      style={styles.detailImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.detailImagePlaceholder}>
                      <Dumbbell size={60} color="#9CA3AF" />
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.imageOverlay}>
                    <Text style={styles.detailExerciseName}>
                      {selectedExercise.name}
                    </Text>
                    <View style={styles.overlayTags}>
                      <View style={[
                        styles.overlayTag,
                        selectedExercise.completed ? styles.completedOverlayTag : styles.pendingOverlayTag
                      ]}>
                        <Text style={styles.overlayTagText}>
                          {selectedExercise.completed ? 'Completed' : 'Pending'}
                        </Text>
                      </View>
                      <View style={styles.overlayTag}>
                        <Text style={styles.overlayTagText}>
                          {selectedExercise.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Basic Info */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Exercise Information</Text>
                  
                  {renderDetailItem(
                    <Clock size={20} color="#10B981" />,
                    'Duration',
                    `${selectedExercise.duration} minutes`
                  )}
                  
                  {renderDetailItem(
                    <Award size={20} color="#F59E0B" />,
                    'Difficulty',
                    selectedExercise.difficulty
                  )}
                  
                  {renderDetailItem(
                    <Target size={20} color="#EF4444" />,
                    'Category',
                    selectedExercise.category
                  )}

                  {selectedExercise.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.descriptionText}>
                        {selectedExercise.description}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                  <Text style={styles.sectionTitle}>Exercise Stats</Text>
                  
                  <View style={styles.statsGrid}>
                    {selectedExercise.calories && (
                      <View style={styles.statCard}>
                        <Text style={styles.gridStatValue}>{selectedExercise.calories}</Text>
                        <Text style={styles.gridStatLabel}>Calories</Text>
                      </View>
                    )}
                    
                    {selectedExercise.sets && (
                      <View style={styles.statCard}>
                        <Text style={styles.gridStatValue}>{selectedExercise.sets}</Text>
                        <Text style={styles.gridStatLabel}>Sets</Text>
                      </View>
                    )}
                    
                    {selectedExercise.reps && (
                      <View style={styles.statCard}>
                        <Text style={styles.gridStatValue}>{selectedExercise.reps}</Text>
                        <Text style={styles.gridStatLabel}>Reps</Text>
                      </View>
                    )}
                    
                    {selectedExercise.distance && (
                      <View style={styles.statCard}>
                        <Text style={styles.gridStatValue}>{selectedExercise.distance}</Text>
                        <Text style={styles.gridStatLabel}>Distance</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Equipment */}
                {selectedExercise.equipment && selectedExercise.equipment.length > 0 && (
                  <View style={styles.equipmentSection}>
                    <Text style={styles.sectionTitle}>Required Equipment</Text>
                    <View style={styles.equipmentList}>
                      {selectedExercise.equipment.map((item: string, index: number) => (
                        <View key={index} style={styles.equipmentItem}>
                          <Text style={styles.equipmentText}>• {item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Instructions */}
                {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                  <View style={styles.instructionsSection}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <View style={styles.instructionsList}>
                      {selectedExercise.instructions.map((instruction: string, index: number) => (
                        <View key={index} style={styles.instructionItem}>
                          <View style={styles.instructionNumber}>
                            <Text style={styles.instructionNumberText}>{index + 1}</Text>
                          </View>
                          <Text style={styles.instructionText}>{instruction}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Tips */}
                {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                  <View style={styles.tipsSection}>
                    <Text style={styles.sectionTitle}>Pro Tips</Text>
                    <View style={styles.tipsList}>
                      {selectedExercise.tips.map((tip: string, index: number) => (
                        <View key={index} style={styles.tipItem}>
                          <Text style={styles.tipText}>💡 {tip}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      selectedExercise.completed ? styles.uncompleteButton : styles.completeButton
                    ]}
                    onPress={() => {
                      toggleComplete(selectedExercise.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.actionButtonText}>
                      {selectedExercise.completed ? 'Mark as Pending' : 'Mark as Completed'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      Alert.alert(
                        'Delete Exercise',
                        'Are you sure you want to delete this exercise?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                              deleteExercise(selectedExercise.id);
                              setModalVisible(false);
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                      Delete Exercise
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 50,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImageContainer: {
    width: 100,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  completedIndicator: {
    backgroundColor: '#10B981',
  },
  pendingIndicator: {
    backgroundColor: '#F59E0B',
  },
  cardInfo: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  durationText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  exerciseDetails: {
    marginTop: 'auto',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 4,
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 4,
  },
  beginnerTag: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  intermediateTag: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  advancedTag: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  completedStat: {
    color: '#10B981',
  },
 quickStatLabel: {
  fontSize: 12,
  color: '#6B7280',
  letterSpacing: 0.5,
},

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },

  // Detail View Styles
  detailImageContainer: {
    position: 'relative',
    height: 200,
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  detailExerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  overlayTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  completedOverlayTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
  },
  pendingOverlayTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.8)',
  },
  overlayTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },

  // Sections
  detailsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  equipmentSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  instructionsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tipsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  // Common Components
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Description
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  gridStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  gridStatLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Equipment
  equipmentList: {
    marginTop: 8,
  },
  equipmentItem: {
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },

  // Instructions
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },

  // Tips
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },

  // Action Buttons
  actionButtons: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  uncompleteButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  deleteButtonText: {
    color: '#DC2626',
  },
});

// import { router } from 'expo-router';
// import { Save, X } from 'lucide-react-native';
// import React, { useState } from 'react';
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { Exercise } from '../types';

// export default function AddExerciseScreen() {
//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     category: '',
//     difficulty: 'Beginner' as Exercise['difficulty'],
//     duration: '',
//   });

//   const categories = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Endurance'];
//   const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

//   const handleSave = () => {
//     if (!form.name.trim()) {
//       Alert.alert('Error', 'Please enter exercise name');
//       return;
//     }

//     if (!form.duration || parseInt(form.duration) <= 0) {
//       Alert.alert('Error', 'Please enter valid duration');
//       return;
//     }

//     // In a real app, you would save to state management or database
//     Alert.alert('Success', 'Exercise added successfully!', [
//       {
//         text: 'OK',
//         onPress: () => router.back(),
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
//           <X size={24} color="#6B7280" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add New Exercise</Text>
//         <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
//           <Save size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.formContainer}>
//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Exercise Name *</Text>
//           <TextInput
//             style={styles.input}
//             value={form.name}
//             onChangeText={text => setForm({ ...form, name: text })}
//             placeholder="e.g., Push-ups, Running, Yoga"
//           />
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             value={form.description}
//             onChangeText={text => setForm({ ...form, description: text })}
//             placeholder="Describe the exercise..."
//             multiline
//             numberOfLines={3}
//           />
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Category</Text>
//           <View style={styles.categoryContainer}>
//             {categories.map(category => (
//               <TouchableOpacity
//                 key={category}
//                 style={[
//                   styles.categoryButton,
//                   form.category === category && styles.categoryButtonSelected,
//                 ]}
//                 onPress={() => setForm({ ...form, category })}
//               >
//                 <Text
//                   style={[
//                     styles.categoryButtonText,
//                     form.category === category &&
//                       styles.categoryButtonTextSelected,
//                   ]}
//                 >
//                   {category}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Difficulty Level</Text>
//           <View style={styles.difficultyContainer}>
//             {difficultyLevels.map(level => (
//               <TouchableOpacity
//                 key={level}
//                 style={[
//                   styles.difficultyButton,
//                   form.difficulty === level && styles.difficultyButtonSelected,
//                 ]}
//                 onPress={() => setForm({ ...form, difficulty: level })}
//               >
//                 <Text
//                   style={[
//                     styles.difficultyButtonText,
//                     form.difficulty === level &&
//                       styles.difficultyButtonTextSelected,
//                   ]}
//                 >
//                   {level}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Duration (minutes) *</Text>
//           <TextInput
//             style={styles.input}
//             value={form.duration}
//             onChangeText={text => setForm({ ...form, duration: text })}
//             placeholder="e.g., 30"
//             keyboardType="numeric"
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   saveButton: {
//     backgroundColor: '#10B981',
//     borderRadius: 8,
//     padding: 8,
//   },
//   formContainer: {
//     padding: 20,
//   },
//   formGroup: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   textArea: {
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   categoryButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#E5E7EB',
//   },
//   categoryButtonSelected: {
//     backgroundColor: '#3B82F6',
//   },
//   categoryButtonText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   categoryButtonTextSelected: {
//     color: 'white',
//     fontWeight: '500',
//   },
//   difficultyContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   difficultyButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: '#E5E7EB',
//     alignItems: 'center',
//   },
//   difficultyButtonSelected: {
//     backgroundColor: '#3B82F6',
//   },
//   difficultyButtonText: {
//     color: '#6B7280',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   difficultyButtonTextSelected: {
//     color: 'white',
//   },
// });