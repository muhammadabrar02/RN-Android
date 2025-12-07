// app/(tabs)/completed.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Exercise } from '../context/ExerciseContext';

import { CheckCircle2, X, Clock, Calendar, Target, Trash2 } from 'lucide-react-native';
import { useExercises } from '../context/ExerciseContext';

const { width } = Dimensions.get('window');

export default function CompletedScreen() {
  const { completedExercises, toggleComplete, deleteExercise } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleExercisePress = (exercise: any) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExercise(id);
            setModalVisible(false);
          },
        },
      ]
    );
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed Exercises</Text>
        <Text style={styles.subtitle}>
          Total: {completedExercises.length} {completedExercises.length === 1 ? 'exercise' : 'exercises'}
        </Text>
      </View>

      <FlatList
        data={completedExercises}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.completedCard}
            onPress={() => handleExercisePress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardImageContainer}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <CheckCircle2 size={40} color="#9CA3AF" />
                  </View>
                )}
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>
              
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <CheckCircle2 size={20} color="#10B981" />
                  <Text style={styles.exerciseName}>{item.name}</Text>
                </View>
                
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailColumn}>
                      <Text style={styles.dateText}>
                        {item.completedDate || new Date().toISOString().split('T')[0]}
                      </Text>
                    </View>
                    <View style={styles.detailColumn}>
                      <Text style={styles.durationText}>{item.duration} min</Text>
                    </View>
                  </View>
                  
                  {item.calories && (
                    <View style={styles.statsRow}>
                      <Text style={styles.caloriesText}>🔥 {item.calories} cal</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CheckCircle2 size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No completed exercises yet!</Text>
            <Text style={styles.emptySubtext}>
              Mark exercises as completed in the Home tab
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
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
                <X size={24} color="#1F2937" />
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
                      <CheckCircle2 size={60} color="#9CA3AF" />
                      <Text style={styles.noImageText}>Completed</Text>
                    </View>
                  )}
                  <View style={styles.imageOverlay}>
                    <Text style={styles.detailExerciseName}>
                      {selectedExercise.name}
                    </Text>
                    <View style={styles.detailCategoryTag}>
                      <Text style={styles.detailCategoryText}>
                        {selectedExercise.category}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Basic Info */}
                <View style={styles.detailsSection}>
                  {renderDetailItem(
                    <Calendar size={20} color="#3B82F6" />,
                    'Completed Date',
                    selectedExercise.completedDate || new Date().toISOString().split('T')[0]
                  )}
                  
                  {renderDetailItem(
                    <Clock size={20} color="#10B981" />,
                    'Duration',
                    `${selectedExercise.duration} minutes`
                  )}

                  {renderDetailItem(
                    <Target size={20} color="#F59E0B" />,
                    'Difficulty',
                    selectedExercise.difficulty
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

                {/* Stats */}
                <View style={styles.statsSection}>
                  <Text style={styles.sectionTitle}>Exercise Stats</Text>
                  
                  {selectedExercise.calories && (
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{selectedExercise.calories}</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                      </View>
                      
                      {selectedExercise.distance && (
                        <View style={styles.statCard}>
                          <Text style={styles.statValue}>{selectedExercise.distance}</Text>
                          <Text style={styles.statLabel}>Distance</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {selectedExercise.sets && (
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{selectedExercise.sets}</Text>
                        <Text style={styles.statLabel}>Sets</Text>
                      </View>
                      
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                          {selectedExercise.reps || selectedExercise.holdTime}
                        </Text>
                        <Text style={styles.statLabel}>
                          {selectedExercise.reps ? 'Reps' : 'Hold Time'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Additional Details */}
                  {selectedExercise.equipment && selectedExercise.equipment.length > 0 && (
                    <View style={styles.equipmentSection}>
                      <Text style={styles.sectionTitle}>Equipment Used</Text>
                      <View style={styles.equipmentList}>
                        {selectedExercise.equipment.map((item: string, index: number) => (
                          <View key={index} style={styles.equipmentItem}>
                            <Text style={styles.equipmentText}>• {item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.markPendingButton]}
                    onPress={() => {
                      toggleComplete(selectedExercise.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.markPendingButtonText}>Mark as Pending</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(selectedExercise.id)}
                  >
                    <Trash2 size={20} color="#DC2626" />
                    <Text style={styles.deleteButtonText}>Delete Exercise</Text>
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
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  completedCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'column',
  },
  cardImageContainer: {
    position: 'relative',
    height: 160,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  cardInfo: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  cardDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailColumn: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    textAlign: 'right',
  },
  statsRow: {
    marginTop: 8,
  },
  caloriesText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
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
    textAlign: 'center',
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
    backgroundColor: '#F0FDF4',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  detailExerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  detailCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },

  // Details Section
  detailsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 8,
  },

  // Stats Section
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Equipment
  equipmentSection: {
    marginTop: 20,
  },
  equipmentList: {
    marginTop: 8,
  },
  equipmentItem: {
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
  },

  // Action Buttons
  actionButtons: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  markPendingButton: {
    backgroundColor: '#F59E0B',
  },
  markPendingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
});

// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { CheckCircle2 } from 'lucide-react-native';

// // Mock completed exercises
// const completedExercises = [
//   {
//     id: '1',
//     name: 'Running',
//     date: '2024-01-15',
//     duration: 30,
//     category: 'Cardio',
//   },
//   {
//     id: '2',
//     name: 'Push-ups',
//     date: '2024-01-14',
//     duration: 10,
//     category: 'Strength',
//   },
//   {
//     id: '3',
//     name: 'Plank',
//     date: '2024-01-13',
//     duration: 5,
//     category: 'Core',
//   },
// ];

// export default function CompletedScreen() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Completed Exercises</Text>
//         <Text style={styles.subtitle}>
//           Total: {completedExercises.length} exercises
//         </Text>
//       </View>

//       <FlatList
//         data={completedExercises}
//         renderItem={({ item }) => (
//           <View style={styles.completedCard}>
//             <View style={styles.cardHeader}>
//               <CheckCircle2 size={20} color="#10B981" />
//               <Text style={styles.exerciseName}>{item.name}</Text>
//             </View>
//             <View style={styles.cardDetails}>
//               <Text style={styles.dateText}>{item.date}</Text>
//               <Text style={styles.durationText}>{item.duration} min</Text>
//               <Text style={styles.categoryTag}>{item.category}</Text>
//             </View>
//           </View>
//         )}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <CheckCircle2 size={48} color="#9CA3AF" />
//             <Text style={styles.emptyText}>No completed exercises yet!</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   listContainer: {
//     padding: 16,
//   },
//   completedCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   exerciseName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginLeft: 12,
//     flex: 1,
//   },
//   cardDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   durationText: {
//     fontSize: 14,
//     color: '#3B82F6',
//     fontWeight: '500',
//   },
//   categoryTag: {
//     backgroundColor: '#F0F9FF',
//     color: '#0369A1',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 80,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#9CA3AF',
//     marginTop: 16,
//   },
// });