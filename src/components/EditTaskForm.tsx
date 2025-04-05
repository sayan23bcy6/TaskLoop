
import React, { useState } from 'react';
import { TaskType } from '@/lib/types';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditTaskFormProps {
  task: TaskType;
  onSubmit: (task: TaskType) => void;
  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [location, setLocation] = useState(task.location);
  const [reward, setReward] = useState(task.reward);
  const [deadline, setDeadline] = useState<Date>(new Date(task.deadline));
  const [dateOpen, setDateOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 45) {
      newErrors.title = 'Title must be 45 characters or less';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > 450) {
      newErrors.description = 'Description must be 450 characters or less';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    } else if (location.length > 45) {
      newErrors.location = 'Location must be 45 characters or less';
    }
    
    if (!reward || reward <= 0) {
      newErrors.reward = 'Reward must be greater than 0';
    } else if (reward > 5000) {
      newErrors.reward = 'Reward must be 5000 or less';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (deadline < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedTask: TaskType = {
        ...task,
        title,
        description,
        location,
        reward,
        deadline
      };
      
      onSubmit(updatedTask);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[calc(90vh-10rem)] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={45}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        <p className="text-xs text-muted-foreground">{title.length}/45 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          placeholder="Describe the task in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={450}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        <p className="text-xs text-muted-foreground">{description.length}/450 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location"
          placeholder="Task location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={45}
        />
        {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        <p className="text-xs text-muted-foreground">{location.length}/45 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reward">Reward (₹)</Label>
        <Input 
          id="reward"
          type="number"
          min="1"
          max="5000"
          value={reward}
          onChange={(e) => setReward(Number(e.target.value))}
        />
        {errors.reward && <p className="text-sm text-red-500">{errors.reward}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP HH:mm") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={(date) => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setHours(deadline ? deadline.getHours() : new Date().getHours());
                  newDate.setMinutes(deadline ? deadline.getMinutes() : new Date().getMinutes());
                  setDeadline(newDate);
                  setDateOpen(false);
                }
              }}
            />
            <div className="p-3 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="HH"
                  className="w-20"
                  value={deadline ? deadline.getHours() : ''}
                  onChange={(e) => {
                    const hours = Number(e.target.value);
                    if (deadline && !isNaN(hours) && hours >= 0 && hours <= 23) {
                      const newDate = new Date(deadline);
                      newDate.setHours(hours);
                      setDeadline(newDate);
                    }
                  }}
                />
                <span className="flex items-center">:</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="MM"
                  className="w-20"
                  value={deadline ? deadline.getMinutes() : ''}
                  onChange={(e) => {
                    const minutes = Number(e.target.value);
                    if (deadline && !isNaN(minutes) && minutes >= 0 && minutes <= 59) {
                      const newDate = new Date(deadline);
                      newDate.setMinutes(minutes);
                      setDeadline(newDate);
                    }
                  }}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {errors.deadline && <p className="text-sm text-red-500">{errors.deadline}</p>}
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditTaskForm;
