class ChartDataSetsController < ApplicationController
  def show
    render json: dataset
  end

  private

    def dataset
      %w(x y z).map do |axis|
        {
          name: axis,
          data: base_query.pluck(:measured_at, axis)
        }
      end
    end

    def base_query
      @_base_query ||= AccelerometerDataPoint.
        where("created_at > ?", 1.minutes.ago).
        where(
          vibe: false,
          watch_id: watch_id
        )
    end

    def watch_id
      params[:watch_id]
    end
end
