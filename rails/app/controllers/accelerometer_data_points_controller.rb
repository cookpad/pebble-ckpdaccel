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
        milliseconds: accel["time"]
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
