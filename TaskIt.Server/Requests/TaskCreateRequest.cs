﻿using System.ComponentModel.DataAnnotations;
using TaskIt.Server.Core.Enums;

namespace TaskIt.Server.Requests
{
    public class TaskCreateRequest
    {
        public int? AssignedUserId { get; set; }

        [Required, MaxLength(30)]
        public required string Title { get; set; }

        [Required, MaxLength(300)]
        public required string Description { get; set; }
        public TasksPriority Priority { get; set; } = TasksPriority.Medium;
        public DateTime? DueDate { get; set; }
    }
}
