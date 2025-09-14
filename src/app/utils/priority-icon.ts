export const priorityIcon = (priority: string) => {
  switch (priority) {
    case 'High':
      return { icon: 'lucideFlame', color: 'red' };
    case 'Medium':
      return { icon: 'lucideActivity', color: 'orange' };
    case 'Low':
      return { icon: 'lucideLeaf', color: 'green' };
    default:
      return { icon: '', color: '' };
  }
};
