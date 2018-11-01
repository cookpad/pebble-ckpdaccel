class CreateAccelerometerDataPoints < ActiveRecord::Migration[5.2]
  def change
    create_table :accelerometer_data_points do |t|
      t.string :watch_id, foreign_key: true
      t.integer :x
      t.integer :y
      t.integer :z
      t.boolean :vibe
      t.integer :milliseconds, limit: 8

      t.timestamps
    end
  end
end
