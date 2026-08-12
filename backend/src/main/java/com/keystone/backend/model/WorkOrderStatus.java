package com.keystone.backend.model;

import java.util.EnumSet;
import java.util.Set;

public enum WorkOrderStatus {
    NEW,
    ASSIGNED,
    IN_PROGRESS,
    ON_HOLD,
    COMPLETED,
    CLOSED;

    private static final Set<WorkOrderStatus> NEW_TRANSITIONS = EnumSet.of(ASSIGNED);
    private static final Set<WorkOrderStatus> ASSIGNED_TRANSITIONS = EnumSet.of(IN_PROGRESS);
    private static final Set<WorkOrderStatus> IN_PROGRESS_TRANSITIONS = EnumSet.of(ON_HOLD, COMPLETED);
    private static final Set<WorkOrderStatus> ON_HOLD_TRANSITIONS = EnumSet.of(IN_PROGRESS, COMPLETED);
    private static final Set<WorkOrderStatus> COMPLETED_TRANSITIONS = EnumSet.of(CLOSED);
   private static final Set<WorkOrderStatus> CLOSED_TRANSITIONS =
        EnumSet.of(NEW, IN_PROGRESS, ON_HOLD, COMPLETED);

    public static WorkOrderStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
         return WorkOrderStatus.valueOf(
        value.trim().toUpperCase().replace(" ", "_")
);
    }

    public boolean canTransitionTo(WorkOrderStatus target) {
        if (this == target) {
            return false;
        }
        return allowedTargets().contains(target);
    }

    private Set<WorkOrderStatus> allowedTargets() {
        return switch (this) {
            case NEW -> NEW_TRANSITIONS;
            case ASSIGNED -> ASSIGNED_TRANSITIONS;
            case IN_PROGRESS -> IN_PROGRESS_TRANSITIONS;
            case ON_HOLD -> ON_HOLD_TRANSITIONS;
            case COMPLETED -> COMPLETED_TRANSITIONS;
            case CLOSED -> CLOSED_TRANSITIONS;
        };
    }
}
