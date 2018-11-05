class RenameMillisecondsToMeasuredAt < ActiveRecord::Migration[5.2]
  def change
    rename_column(:accelerometer_data_points, :milliseconds, :measured_at)
    change_column(:accelerometer_data_points, :measured_at, :datetime, limit: 3)
  end
end
