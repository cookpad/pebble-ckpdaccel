class AccelerometerDataPointsController < ApplicationController
  skip_forgery_protection

  def create
    accels.each do |accel|
      AccelerometerDataPoint.create(
        watch_id: watch_id,
        x: accel["x"],
        y: accel["y"],
        z: accel["z"],
        vibe: accel["vibe"] != 0,
        measured_at: Time.strptime(accel["time"].to_s, "%Q")
      )
    end
    render json: { result: "ok" }
  end

  private

    def watch_id
      params[:watch_id]
    end

    def accels
      params[:accels]
    end
end
