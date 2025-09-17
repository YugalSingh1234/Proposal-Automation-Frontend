import React from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { Project } from '../types/api';

interface ProjectsEditorProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  startSno: number;
  onStartSnoChange: (sno: number) => void;
  errors: Record<string, string>;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({
  projects,
  onProjectsChange,
  startSno,
  onStartSnoChange,
  errors,
}) => {
  const addProject = () => {
    onProjectsChange([...projects, { Project_Names: '', Location: '' }]);
  };

  const removeProject = (index: number) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    onProjectsChange(newProjects);
  };

  const getFieldError = (index: number, field: string) => {
    return errors[`projects.${index}.${field}`];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Projects</label>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Starting S. No.</label>
          <input
            type="number"
            value={startSno}
            onChange={(e) => onStartSnoChange(parseInt(e.target.value) || 1)}
            min={1}
            className={`w-20 px-2 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.projects_start_sno ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.projects_start_sno && (
            <span className="text-red-600 text-xs">{errors.projects_start_sno}</span>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-500 italic py-4">No projects added</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Project {startSno + index}
                </span>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                  title="Remove project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.Project_Names}
                    onChange={(e) => updateProject(index, 'Project_Names', e.target.value)}
                    placeholder="Enter project name"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      getFieldError(index, 'Project_Names') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError(index, 'Project_Names') && (
                    <span className="text-red-600 text-xs mt-1">
                      {getFieldError(index, 'Project_Names')}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={project.Location}
                    onChange={(e) => updateProject(index, 'Location', e.target.value)}
                    placeholder="Enter project location"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      getFieldError(index, 'Location') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError(index, 'Location') && (
                    <span className="text-red-600 text-xs mt-1">
                      {getFieldError(index, 'Location')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};